.DEFAULT_GOAL := check
NODE_IMAGE := node:$(shell sed 's/^v//' .nvmrc)
SHELLCHECK_IMAGE := koalaman/shellcheck:v0.11.0

export NODE_IMAGE SHELLCHECK_IMAGE
CHECK_TASKS := lint build
BUILD_OUTPUTS := dist
TEST_OUTPUTS :=
CONTAINER_BUILD_ARGS := NODE_VERSION=$(shell sed 's/^v//' .nvmrc)

override COMMAND := $(value COMMAND)
override TEST_ARGS := $(value TEST_ARGS)

export CHECK_TASKS BUILD_OUTPUTS TEST_OUTPUTS CONTAINER_BUILD_ARGS TEST_ARGS COMMAND
export CHECK_TIMEOUT_SECONDS CHECK_MEMORY CHECK_SCRATCH_SIZE CHECK_WORK_SIZE CHECK_TMP_SIZE CHECK_NETWORK_LINT CONTAINER_IMAGE
export CHECK_ADMISSION

.PHONY: check lint test build exec

check lint test build:
	@./tests/container/check-stock $@

exec:
	@./tests/container/run exec
