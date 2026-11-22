# haddoapp - Makefile
# Read-only book browser for the iPhone (React + Vite), fed by a books.json
# that a small Python script exports from a COPY of the haddolib database.
# Wraps npm commands for JavaScript and Python utilities.

# --- Node.js Variables ---
NODE_MODULES = node_modules
SETUP_STAMP = $(NODE_MODULES)/.setup_stamp

# --- Python Variables (for utility scripts and their tests) ---
# The venv's own python is called directly, so no activation is needed.
PYTHON ?= python3
VENV_DIR = .venv
VENV_PYTHON = $(VENV_DIR)/bin/python
VENV_PIP = $(VENV_DIR)/bin/pip
PYTHON_SETUP_STAMP = $(VENV_DIR)/.setup_stamp

# --- Data Variables ---
# DB:     the COPY of the haddolib database (never the live one in the VM).
#         Private data: data/ must be in .gitignore.
# BOOKS:  the exported extract the app loads. Also private: in .gitignore.
# SCHEMA: the table structure only, no books. Safe to commit.
# Override any of them on the command line, e.g.  make export DB=~/Desktop/haddolib-copy.db
DB ?= data/haddolib-copy.db
BOOKS ?= public/books.json
SCHEMA ?= docs/schema.sql

# --- Tree (folders not shown in the project tree) ---
TREE_IGNORE = node_modules|dist|build|.git|.idea|.vscode|.venv|__pycache__|.pytest_cache|tmp|data

# --- Phony targets ---
.PHONY: all setup setup-python
.PHONY: dev build preview
.PHONY: test test-js test-py test-watch
.PHONY: export schema
.PHONY: patch commit-hash
.PHONY: showtree gentree filesdump filesdump-detailed
.PHONY: clean help

# Default target
all: setup

# --- Node.js Setup ---
$(SETUP_STAMP): package.json
	@echo "--- Installing npm dependencies ---"
	npm install
	@echo "--- Node.js setup complete ---"
	@touch $(SETUP_STAMP)

setup: $(SETUP_STAMP) ## Install npm dependencies

# --- Python Setup (for utility scripts and their tests) ---
$(VENV_DIR)/bin/activate:
	$(PYTHON) -m venv $(VENV_DIR)

$(PYTHON_SETUP_STAMP): $(VENV_DIR)/bin/activate scripts/requirements.txt
	@echo "--- Installing Python dependencies ---"
	$(VENV_PIP) install -r scripts/requirements.txt
	@echo "--- Python setup complete ---"
	@touch $(PYTHON_SETUP_STAMP)

setup-python: $(PYTHON_SETUP_STAMP) ## Create the Python venv and install scripts/requirements.txt

# --- Development ---
dev: $(SETUP_STAMP) ## Start the development server (Vite)
	npm run dev

build: $(SETUP_STAMP) ## Build for production into dist/
	npm run build

preview: $(SETUP_STAMP) ## Preview the production build
	npm run preview

# --- Testing ---
# JavaScript tests (Vitest) live next to the code as *.test.js(x);
# Python tests (pytest) live in tests/.
test: test-js test-py ## Run all tests once (JavaScript and Python)

test-js: $(SETUP_STAMP) ## Run the JavaScript tests once (Vitest)
	npm run test:run -- --passWithNoTests

test-py: $(PYTHON_SETUP_STAMP) ## Run the Python tests (pytest, in tests/)
	@test -d tests || { echo "No tests/ folder yet - nothing to run"; exit 0; }; \
	$(VENV_PYTHON) -m pytest -q tests; rc=$$?; \
	if [ $$rc -eq 5 ]; then echo "No Python tests yet"; exit 0; fi; \
	exit $$rc

test-watch: $(SETUP_STAMP) ## Run the JavaScript tests in watch mode
	npm run test

# --- Data ---
export: $(PYTHON_SETUP_STAMP) ## Export books.json from the database copy (DB=...)
	@test -f "$(DB)" || { echo "No database copy at $(DB) - copy it there, or pass DB=..."; exit 1; }
	@echo "--- Exporting $(DB) -> $(BOOKS) ---"
	$(VENV_PYTHON) scripts/export_books.py "$(DB)" "$(BOOKS)"

schema: ## Write the table structure of the database copy to docs/schema.sql
	@test -f "$(DB)" || { echo "No database copy at $(DB) - copy it there, or pass DB=..."; exit 1; }
	@mkdir -p $(dir $(SCHEMA))
	sqlite3 -readonly "$(DB)" .schema > $(SCHEMA)
	@echo "Schema written to $(SCHEMA)"

# --- Collaboration ---
patch: ## Apply all *.patch files in the repo root, then move them to tmp/applied-patches/
	@ls *.patch >/dev/null 2>&1 || { echo "No *.patch files in the repo root"; exit 1; }
	git apply --check *.patch
	git apply *.patch
	@mkdir -p tmp/applied-patches
	mv *.patch tmp/applied-patches/

commit-hash: ## Copy the current commit hash to the clipboard, for the start of a session
	@printf 'Commit hash: `%s`' "$$(git rev-parse --short HEAD)" | pbcopy
	@echo "Commit hash copied to clipboard"

# --- Project Documentation ---
showtree: ## Display the project structure
	@tree --dirsfirst -I "$(TREE_IGNORE)" -L 3

gentree: ## Save the project structure to tmp/project_tree.txt
	@mkdir -p tmp
	@tree --dirsfirst -I "$(TREE_IGNORE)" > tmp/project_tree.txt
	@echo "Project tree saved to tmp/project_tree.txt"

filesdump: gentree ## Create a context dump for LLMs from manifest.lst
	@test -f manifest.lst || { echo "Error: manifest.lst not found"; exit 1; }
	$(PYTHON) tools/concat_files.py manifest.lst > tmp/filesdump.txt
	@echo "Filesdump created at tmp/filesdump.txt"

filesdump-detailed: gentree ## Create a context dump for LLMs, with per-file size details
	@test -f manifest.lst || { echo "Error: manifest.lst not found"; exit 1; }
	$(PYTHON) tools/concat_files.py --detailed --sort manifest.lst > tmp/filesdump.txt
	@echo "Filesdump created at tmp/filesdump.txt"

# --- Cleanup ---
# Leaves data/ (your database copy) alone; removes the exported books.json,
# which `make export` recreates.
clean: ## Remove node_modules, the venv, build artifacts, caches, tmp/ and books.json
	rm -rf $(NODE_MODULES)
	rm -rf $(VENV_DIR)
	rm -rf dist build tmp .pytest_cache
	rm -f $(BOOKS)
	find . -name "__pycache__" -type d -prune -exec rm -rf {} + 2>/dev/null || true
	@echo "Cleaned all build artifacts and dependencies"

# --- Help ---
help: ## Show this help message
	@echo "haddoapp - Available targets:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Common workflows:"
	@echo "  make commit-hash       - Start of a session: commit hash to the clipboard"
	@echo "  make export            - Export books.json from data/haddolib-copy.db"
	@echo "  make dev               - Start the app on the Mac"
	@echo "  make test              - Run all tests once"
	@echo "  make patch             - Apply the patches from a session"
	@echo "  make schema            - Refresh docs/schema.sql from the database copy"
