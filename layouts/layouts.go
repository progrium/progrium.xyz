package layouts

import (
	"fmt"

	"github.com/a-h/templ"
	"progrium.xyz/model"
)

type Layout = func(view model.View) templ.Component

func Get(name string) (Layout, error) {
	l, ok := map[string]Layout{
		"main": Main,
		"blog": Blog,
	}[name]
	if !ok {
		return nil, fmt.Errorf("layout not found: %s", name)
	}
	return l, nil
}
