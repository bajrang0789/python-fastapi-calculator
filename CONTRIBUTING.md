## Contributing

Thanks for improving the calculator app.

### Workflow

1. Open or reference an issue before implementing a larger change.
2. Make the smallest change that solves the problem.
3. Run the relevant checks before opening a pull request:

```bash
pytest -q
black --check app tests
ruff check app tests
mypy app
cd frontend && npm run build
```

### Review expectations

- Keep API behavior backward compatible unless the issue explicitly calls for a breaking change.
- Update the README when the user-facing behavior changes.
- Add tests for new backend behavior.
