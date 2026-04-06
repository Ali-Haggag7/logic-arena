# CHANGELOG

## 2026-04-05

### [0.2.0] - The Server-Engine Integration

The `packages/engine` module has been successfully integrated with the NestJS server using WebSockets. This crucial step merged the core game logic with the server architecture, enabling real-time communication and game state synchronization.

**Technical Scars and Resolutions:**

*   **Issue:** Fixed 'Module not found' by reconfiguring `outDir` in `nest-cli.json` and switching to manual `node dist/...` execution.
*   **Issue:** Resolved PowerShell-specific errors by replacing `rm -rf` with `Remove-Item` and `&&` with `;`.
*   **Issue:** Handled `EADDRINUSE` by identifying and killing ghost processes on ports 3000/3001 using `taskkill`.

**Key Technical Achievement:**

*   Successfully linked `@logic-arena/engine` using `pnpm` workspace syntax.

**Current Status:** The server operates at 60 FPS (or 30), and robot position broadcasting is functioning efficiently, providing a synchronized and seamless gaming experience.

## [0.3.0] - The Visual Pulse & State Synchronization

Successfully synchronized the Backend physics engine with the Frontend Canvas renderer, achieving 60 FPS neon-glow robot movement.

### Technical Scars and Resolutions:
- **Issue:** Fixed 'Array(0)' state issue by enforcing a **Singleton Pattern** using `@Global()` in `GameModule`, ensuring Gateway and Service share the same engine instance.
- **Issue:** Resolved TypeScript compilation errors in Monorepo by fixing `isolatedModules` conflicts and correctly using `export type` for shared interfaces.
- **Issue:** Fixed Frontend rendering lag by correcting object mapping (accessing `position.x` instead of `x`) and implementing `requestAnimationFrame` for smooth Canvas drawing.

### Key Technical Achievement:
- Established a stable **Full-Stack Event Pipeline**: GameLoop (Engine) -> Socket.io (Server) -> HTML5 Canvas (Client).

### Current Status: 
- Neon robots are dynamically moving in the Arena with zero lag, fully synchronized with server-side physics.