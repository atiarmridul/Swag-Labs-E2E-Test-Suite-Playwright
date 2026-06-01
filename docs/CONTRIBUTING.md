# Contributing

Use this guide when changing tests, page objects, scripts, or documentation.

## Local Workflow

```bash
git pull --rebase
npm install
npx playwright install
npx playwright test
```

For a visible browser run:

```bash
npx playwright test --headed
```

For linting:

```bash
npx eslint .
```

## Code Organization

- `pages/` contains Page Object Model classes.
- `tests/` contains Playwright specs.
- `docs/` contains project, agent, and testing documentation.
- `scripts/` contains local automation utilities.

## Page Object Rules

- Put selectors in page object constructors or readonly properties.
- Keep multi-step user actions in page object methods.
- Prefer `page.getByTestId(...)` for SauceDemo `data-test` attributes.
- Use `page.getByRole(...)` for accessible controls when no test id exists.
- Avoid XPath unless the application provides no stable locator.

## Test Spec Rules

- Keep specs readable at the user-flow level.
- Use page objects for UI interaction.
- Keep assertions close to the behavior they verify.
- Do not hardcode repeated selectors in spec files.
- Ensure async methods use explicit return types (for example `: Promise<void>`) to satisfy linting.

## Documentation Rules

Update Markdown when any of these change:

- File names in `pages/` or `tests/`
- Public page object methods
- Test commands or npm scripts
- Browser projects in `playwright.config.js`
- CI workflow behavior
- Test flow or supported coverage

## Generated Artifacts

Avoid committing generated output unless intentionally needed:

- `playwright-report/`
- `test-results/`
- traces, screenshots, and videos
