.PHONY: all run clean
all:
	tsc
run:
	node ./distsrc/main.js
clean:
	rm distsrc/*
