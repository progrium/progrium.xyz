package jsxtemplate

import (
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	"github.com/dop251/goja"
	"github.com/evanw/esbuild/pkg/api"
)

type Module struct {
	name string
	code string
	vm   *goja.Runtime
}

func NewModule(name string) *Module {
	vm := goja.New()

	return &Module{
		name: name,
		vm:   vm,
	}
}

func (m *Module) ParseFile(filename string) (*Module, error) {
	b, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return m.Parse(string(b))
}

func (m *Module) Parse(text string) (*Module, error) {
	result := api.Transform(text, api.TransformOptions{
		Loader:         api.LoaderJSX,
		JSXFactory:     "hyper",
		JSXSideEffects: true,
	})
	if len(result.Errors) > 0 {
		return nil, fmt.Errorf("error parsing module: %s", result.Errors[0].Text)
	}
	if err := m.vm.Set("hyper", hyper); err != nil {
		return nil, err
	}
	m.code = string(result.Code)
	return m, nil
}

func (m *Module) Execute(w io.Writer, frontmatter any, args ...any) error {
	_, err := m.vm.RunString(m.code)
	if err != nil {
		return err
	}

	if frontmatter != nil {
		fm := m.vm.Get("Frontmatter")
		if fm != nil {
			err = m.vm.ExportTo(fm, frontmatter)
			if err != nil {
				return err
			}
		}
	}

	com, ok := goja.AssertFunction(m.vm.Get("Component"))
	if !ok {
		return fmt.Errorf("could not assert Component as a function")
	}

	var jsArgs []goja.Value
	for _, arg := range args {
		jsArgs = append(jsArgs, m.vm.ToValue(arg))
	}

	res, err := com(goja.Undefined(), jsArgs...)
	if err != nil {
		return err
	}

	var node HyperNode
	err = m.vm.ExportTo(res, &node)
	if err != nil {
		return err
	}

	_, err = io.WriteString(w, node.String())
	return err
}

type HyperNode struct {
	Tag      string
	Attrs    map[string]string
	Children []HyperNode
	Text     string
}

func (h HyperNode) String() string {
	if h.Text != "" {
		return h.Text
	}
	var builder strings.Builder
	builder.WriteString("<" + h.Tag)
	if len(h.Attrs) > 0 {
		builder.WriteString(" ")
		for k, v := range h.Attrs {
			builder.WriteString(k + "=\"" + v + "\" ")
		}
	}
	builder.WriteString(">")
	for _, child := range h.Children {
		builder.WriteString(child.String())
	}
	builder.WriteString("</" + h.Tag + ">")
	return builder.String()
}

func hyper(tag string, attrs map[string]string, children ...any) HyperNode {
	var nodes []HyperNode
	for _, child := range children {
		switch c := child.(type) {
		case HyperNode:
			nodes = append(nodes, c)
		case string:
			nodes = append(nodes, HyperNode{Text: c})
		default:
			log.Panicf("unsupported children type: %T", children)
		}
	}
	return HyperNode{Tag: tag, Attrs: attrs, Children: nodes}
}
