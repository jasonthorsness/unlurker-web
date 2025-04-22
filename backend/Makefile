BIN_DIR := ./bin
TAGS := sqlite_math_functions
LDFLAGS := -s -w
GOFLAGS := -trimpath

.PHONY: all build clean lint test fmt refresh tidy

all: build

$(BIN_DIR):
	mkdir -p $(BIN_DIR)

build: | $(BIN_DIR)
	go build $(GOFLAGS) \
	         -ldflags "$(LDFLAGS)" \
	         -o $(BIN_DIR)/unls \
	         -tags $(TAGS) \
	         ./

lint:
	golangci-lint run

test:
	go test -race ./... -tags $(TAGS)

fmt:
	go fmt ./... && gofumpt -w .

clean:
	rm -rf $(BIN_DIR)

tidy:
	go mod tidy
