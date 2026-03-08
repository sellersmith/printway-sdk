# Contributing to Printway SDK

Thanks for your interest in contributing!

## Development Setup

```bash
git clone https://github.com/sellersmith/printway-sdk.git
cd printway-sdk
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run unit tests |
| `npm run test:integration` | Run integration tests (requires `.env`) |
| `npm run typecheck` | TypeScript type checking |
| `npm run build` | Build CJS + ESM + types |
| `npm run lint` | Lint source code |

## Integration Tests

Copy `.env.example` to `.env` and add your Printway API tokens:

```bash
cp .env.example .env
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Ensure `npm run typecheck && npm test` passes
5. Commit with a descriptive message
6. Open a PR against `main`

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `test:` adding/updating tests
- `chore:` maintenance

## Code Style

- TypeScript strict mode
- No external runtime dependencies
- Node.js >= 18 (native `fetch`)
