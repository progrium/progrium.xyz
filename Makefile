.PHONY: deploy

_public:
	taragen build

deploy: _public
	git branch -D gh-pages || true
	git checkout --orphan gh-pages
	find . -mindepth 1 -maxdepth 1 ! -name public ! -name .git -exec rm -rf {} +
	mv _public/* .
	rm -rf _public
	git add .
	git commit -m "deploy"
	git push -f origin gh-pages
	git switch main