.SILENT:

PACKAGE_VERSION=$(shell cat package.json | grep -i version | sed -e "s/ //g" | cut -c 12- | sed -e "s/\",//g")

.PHONY: install
install:
	yarn install

.PHONY: build
build:
	yarn run build

.PHONY: lint
lint:
	yarn run lint

.PHONY: publish-npmjs
publish-npmjs:
	yarn publish --registry https://registry.npmjs.org/ --access public  --new-version $(PACKAGE_VERSION) --non-interactive

.PHONY: types
types:
	yarn run types