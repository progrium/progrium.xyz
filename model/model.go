package model

type View struct {
	Title       string `yaml:"title"`
	Site        string `yaml:"site"`
	Layout      string `yaml:"layout"`
	Date        string `yaml:"date"`
	Tags        string `yaml:"tags"`
	Description string `yaml:"description"`
	CoverImage  string `yaml:"cover_image"`
}

func DefaultView() View {
	return View{
		Site:       "progrium.xyz",
		CoverImage: "https://progrium.xyz/photo_wide.png",
	}
}
