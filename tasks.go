//go:build mage

// Help text.
package main

import (
	"bytes"
	"context"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path"
	"path/filepath"
	"reflect"
	"sort"
	"strings"
	"syscall"
	"time"

	"github.com/a-h/templ"
	"github.com/magefile/mage/sh"
	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting"
	"github.com/yuin/goldmark/parser"
	"go.abhg.dev/goldmark/frontmatter"
	"gopkg.in/yaml.v3"
	"progrium.xyz/layouts"
	"progrium.xyz/model"
	"tractor.dev/toolkit-go/engine/fs/watchfs"
)

const (
	contentDir = "./content"
	targetDir  = "./public"
)

func toTargetPath(p string) string {
	return strings.Replace(p, strings.Trim(contentDir, "."), strings.Trim(targetDir, "."), 1)
}

func Debug() error {
	log.Println("Hello")
	return nil
}

// This will generate the site
func Generate() error {

	if err := os.RemoveAll("./public"); err != nil {
		return err
	}

	if err := sh.Run("cp", "-r", "./static", "./public"); err != nil {
		return err
	}

	return filepath.Walk(contentDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}

		targetPath := strings.Replace(path, "content", "public", 1)
		targetPath = strings.TrimSuffix(targetPath, ".md")
		targetPath = fmt.Sprintf("%s.html", targetPath)

		switch filepath.Ext(info.Name()) {
		case ".md":
			if err := os.MkdirAll(filepath.Dir(targetPath), 0755); err != nil {
				return err
			}

			contentPath := strings.TrimSuffix(path, filepath.Ext(path))
			fmt.Println(contentPath, "=>", targetPath)

			f, err := os.Create(targetPath)
			if err != nil {
				return err
			}
			defer f.Close()

			if err := generatePage(contentPath, f); err != nil {
				return err
			}

		default:
			// do nothing
		}

		return nil
	})
}

func nav(name string) (entries []*IndexEntry) {
	basePath := path.Join(contentDir, name)
	entriesMap := make(map[string]*IndexEntry)

	err := filepath.Walk(basePath, func(curPath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}

		if filepath.Base(curPath) == "index.template" {
			return nil
		}

		publicPath, _ := filepath.Rel(contentDir, curPath)
		publicPath = strings.TrimSuffix(publicPath, filepath.Ext(publicPath))
		publicPath = strings.TrimSuffix(publicPath, "/index")
		relPath, _ := filepath.Rel(basePath, curPath)
		entry := &IndexEntry{
			Path:     "/" + publicPath,
			Slug:     filepath.Base(publicPath),
			Children: []*IndexEntry{},
		}

		switch filepath.Ext(info.Name()) {
		case ".md", ".template":
			b, err := os.ReadFile(curPath)
			if err != nil {
				return err
			}

			parts := bytes.Split(b, []byte("---\n"))

			var meta model.View
			if err := yaml.Unmarshal(parts[1], &meta); err != nil {
				return err
			}
			entry.View = meta

			dir := filepath.Dir(relPath)
			if dir == "." {
				// put directly into entries
				entries = append(entries, entry)
				return nil
			}
			if parent, ok := entriesMap[dir]; ok {
				parent.Children = append(parent.Children, entry)
			} else {
				entriesMap[dir] = &IndexEntry{
					Path:     "/" + dir,
					Slug:     strings.TrimSuffix(dir, filepath.Ext(dir)),
					Children: []*IndexEntry{entry},
				}
				// create parents
				parts := strings.Split(dir, string(os.PathSeparator))
				for i := len(parts) - 1; i > 0; i-- {
					parentDir := filepath.Join(parts[:i]...)
					if parent, ok := entriesMap[parentDir]; ok {
						found := false
						for _, child := range parent.Children {
							if child.Path == entriesMap[dir].Path {
								found = true
								break
							}
						}
						if !found {
							parent.Children = append(parent.Children, entriesMap[dir])
						}
						break
					}
				}
			}
		}

		return nil
	})
	if err != nil {
		panic(err)
	}

	// Collect top-level entries
	for _, entry := range entriesMap {
		if filepath.Dir(entry.Path) == "/" {
			entries = append(entries, entry)
		}
	}

	sortEntries(entries)
	return
}

// sortEntries sorts a slice of *IndexEntry recursively by Date, or by Slug if Date is empty.
func sortEntries(entries []*IndexEntry) {
	sort.Slice(entries, func(i, j int) bool {
		dateI, dateJ := entries[i].Date, entries[j].Date
		// If date is not empty, parse and compare it; otherwise, compare by slug
		if dateI != "" && dateJ != "" {
			timeI, errI := time.Parse("2006-01-02", dateI)
			timeJ, errJ := time.Parse("2006-01-02", dateJ)
			if errI == nil && errJ == nil {
				return timeI.Before(timeJ)
			}
		}
		// If one or both dates are empty, or there was a parsing error, fall back to comparing by slug
		return entries[i].Slug < entries[j].Slug
	})

	// Recursively sort all children
	for _, entry := range entries {
		if len(entry.Children) > 0 {
			sortEntries(entry.Children)
		}
	}
}

func reverseSlice(slice interface{}) interface{} {
	s := reflect.ValueOf(slice)
	if s.Kind() != reflect.Slice {
		return slice // Return the original if not a slice
	}
	reversed := reflect.MakeSlice(s.Type(), s.Len(), s.Cap())
	for i := 0; i < s.Len(); i++ {
		reversed.Index(i).Set(s.Index(s.Len() - 1 - i))
	}
	return reversed.Interface()
}

type IndexEntry struct {
	Path     string
	Slug     string
	Children []*IndexEntry

	model.View
}

// Create a PageGenerator interface to handle different file formats
type PageGenerator interface {
	Generate([]byte, io.Writer, string) error
}

// Implement generators for markdown and template files
type MarkdownGenerator struct{}
type TemplateGenerator struct{}

// Map file extensions to their generators
var generators = map[string]PageGenerator{
	"md":       &MarkdownGenerator{},
	"template": &TemplateGenerator{},
}

// Common rendering logic for both generators
func renderWithLayout(meta model.View, contents templ.Component, w io.Writer) error {
	ctx := templ.WithChildren(context.Background(), contents)
	layout, err := layouts.Get(meta.Layout)
	if err != nil {
		return err
	}
	return layout(meta).Render(ctx, w)
}

func (mg *MarkdownGenerator) Generate(b []byte, w io.Writer, path string) error {
	md := goldmark.New(goldmark.WithExtensions(highlighting.Highlighting, &frontmatter.Extender{}))
	mdCtx := parser.NewContext()
	var buf bytes.Buffer
	if err := md.Convert(b, &buf, parser.WithContext(mdCtx)); err != nil {
		return err
	}

	d := frontmatter.Get(mdCtx)
	meta := model.DefaultView()
	if err := d.Decode(&meta); err != nil {
		return err
	}

	contents := templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		_, err := buf.WriteTo(w)
		return err
	})

	return renderWithLayout(meta, contents, w)
}

func (tg *TemplateGenerator) Generate(b []byte, w io.Writer, path string) error {
	parts := bytes.Split(b, []byte("---\n"))
	meta := model.DefaultView()
	if err := yaml.Unmarshal(parts[1], &meta); err != nil {
		return err
	}

	contents := templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		tmpl, err := template.New(path).Funcs(template.FuncMap{
			"upper":   strings.ToUpper,
			"nav":     nav,
			"reverse": reverseSlice,
		}).Parse(string(parts[2]))
		if err != nil {
			return err
		}
		return tmpl.Execute(w, meta)
	})

	return renderWithLayout(meta, contents, w)
}

// Simplified generatePage function
func generatePage(path string, w io.Writer) error {
	var format string
	var b []byte
	var err error

	for _, suffix := range []string{".md", ".template", "/index.md", "/index.template"} {
		b, err = os.ReadFile(path + suffix)
		if err == nil {
			format = strings.TrimPrefix(filepath.Ext(suffix), ".")
			break
		}
	}

	if b == nil {
		return fmt.Errorf("unable to find source for: %s", path)
	}

	generator, ok := generators[format]
	if !ok {
		return fmt.Errorf("unsupported format: %s", format)
	}

	return generator.Generate(b, w, path)
}

func quickExit() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		os.Exit(0)
	}()
}

func Serve() error {
	quickExit()

	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	go func() {
		fsys := watchfs.New(os.DirFS("/").(fs.StatFS))
		w, err := fsys.Watch(strings.TrimPrefix(wd, "/"), &watchfs.Config{
			Recursive: true,
		})
		if err != nil {
			panic(err)
		}
		for event := range w.Iter() {
			if filepath.Ext(event.Path) != ".templ" {
				continue
			}
			if err := sh.Run("templ", "generate"); err != nil {
				fmt.Println(err)
			}
		}
	}()

	staticDir := os.DirFS(path.Join(wd, "static"))

	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/favicon.ico" {
			http.Error(w, "Not found", http.StatusNotFound)
			return
		}

		staticFile := strings.TrimPrefix(r.URL.Path, "/")
		if staticFile != "" {
			_, err := fs.Stat(staticDir, staticFile)
			if !os.IsNotExist(err) {
				http.ServeFileFS(w, r, staticDir, staticFile)
				return
			}
		}

		err = generatePage(fmt.Sprintf("./content/%s", strings.TrimPrefix(r.URL.Path, "/")), w)
		if err != nil {
			log.Println("generate:", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}))
	fmt.Println("serving on http://localhost:8088 ...")
	if err := http.ListenAndServe(":8088", nil); err != nil {
		return err
	}
	return nil
}

// var Default = Install
