build:
	docker build -t portfolio:latest .
	docker run -it -p 3000:3000 portfolio:latest
