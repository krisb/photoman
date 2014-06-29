default: lint

clean:
	@rm -f coverage.html
	@rm -rf node_modules

prepare: clean
	@npm install

link:
	npm link

test:
	@./node_modules/.bin/lab

test-watch:
	@nodemon -- ./node_modules/.bin/lab

spec:
	@./node_modules/.bin/lab -v

spec-watch:
	@nodemon -- ./node_modules/.bin/lab -v

cov:
	@./node_modules/.bin/lab -t 100

cov-watch:
	@nodemon -- ./node_modules/.bin/lab -t 100

report:
	@./node_modules/.bin/lab -r html -o coverage.html

lint:
	@./node_modules/.bin/jshint --reporter node_modules/jshint-stylish/stylish.js lib test
	@./node_modules/.bin/jscs lib test

lint-watch:
	@nodemon -- ./node_modules/.bin/jscs lib test

publish: prepare
	npm pack
	npm publish

.PHONY: default clean prepare link test test-watch spec spec-watch cov cov-watch report lint publish
