.PHONY: install dev ios android test clean lint

# Install dependencies
install:
	npm install

# Start development server
dev:
	npx expo start

# Run on iOS simulator
ios:
	npx expo run:ios

# Run on Android emulator
android:
	npx expo run:android

clean-build:
	npx expo prebuild --clean 

# Run tests
test:
	npm test

# Clean build artifacts
clean:
	rm -rf node_modules
	rm -rf .expo
	rm -rf ios/build
	rm -rf android/build
	rm -rf android/app/build

# Lint code
lint:
	npx eslint .
	npx tsc --noEmit

# Help target
help:
	@echo "Available targets:"
	@echo "  install    - Install dependencies"
	@echo "  dev        - Start development server"
	@echo "  ios        - Run on iOS simulator"
	@echo "  android    - Run on Android emulator"
	@echo "  test       - Run tests"
	@echo "  clean      - Clean build artifacts"
	@echo "  lint       - Run linter and type checker"
