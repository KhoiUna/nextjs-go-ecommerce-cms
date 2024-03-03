build:
	go build -o backend main.go

run: build
	./backend

watch:
	reflex -s -r '\.go$$' make run
