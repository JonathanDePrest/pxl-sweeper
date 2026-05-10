Create a complete @IMPLEMENTATION_PLAN.md document for this project. DO NOT START IMPLEMENTATION!! ONLY CREATE THE DOCUMENT!!

Context:
- Project name: [PXL SWEEPER]
- Project type: [SCHOOL PROJECT]
- Goal: [SHORT PRODUCT]
- Constraints: [TEAM / PLATFORM CONSTRAINTS]
- Existing documents available: [REQUIREMENTS.md]
- Deployment target: [STATIC HOST]
- Risk tolerance: [MEDIUM]

Task:
Write the full contents of `IMPLEMENTATION_PLAN.md` in Markdown.

Output rules:
- Output only the final Markdown for `IMPLEMENTATION_PLAN.md`.
- Do not output commentary about your process.
- Do not output a template explanation.
- Do not number document headings.
- Use clear Markdown headings.
- Use phase-driven planning, not a flat task list.

Planning rules:
- Organize the work into sequential phases.
- Each phase must have exactly one primary goal.
- Each phase must end in a reviewable state.
- Order phases by dependency.
- If a phase is too large for one review cycle, split it before finalizing the plan.
- Prefer thin vertical slices where practical.
- Separate risky refactors, infrastructure changes, migrations, and deployment changes into their own phases.
- Include deployment or release phases only if relevant.
- Include a final stabilization and review phase.
- Do not invent major features or systems not implied by the context.
- If information is missing, make the smallest reasonable assumption and record it under `Assumptions`.
- If information is missing and sequencing depends on it, record it under `Open questions` or as a blocker inside the relevant phase.

Required top-level sections:
- Overview
- Assumptions
- Delivery strategy
- Phase list
- Detailed phases
- Dependency notes
- Review policy
- Definition of done for the plan
- Open questions

Requirements for `Delivery strategy`:
- State whether the plan uses vertical slices, layered implementation, or a hybrid.
- Briefly justify the choice.
- State why this strategy fits the project type and review cadence.

Requirements for `Phase list`:
- Provide a short list of all phases in order.
- Give each phase a stable identifier, such as `Phase 1`, `Phase 2`, and so on.
- Each phase title must describe the primary outcome, not a vague activity.

For each phase, include these sections exactly:
- Goal
- Scope
- Expected files to change
- Dependencies
- Risks
- Tests and checks to run
- Review check before moving work to `DONE.md`
- Exact `TODO.md` entries to refresh from this phase
- Exit criteria for moving items to `DONE.md`

Requirements for phase design:
- Each phase must focus on one primary deliverable.
- Each phase must be small enough for one review cycle under the stated review cadence.
- Do not hide multiple large deliverables inside one phase.
- Call out parallelizable work only if it is truly independent.
- Do not use a generic "polish" phase to hide unfinished core work.
- If a research spike or decision is required before implementation can proceed safely, create a dedicated phase for it.

Requirements for `Expected files to change`:
- Be concrete.
- List likely files, folders, or document names.
- If exact names are unknown, give the most likely path patterns.
- Include source files, tests, docs, config, CI, scripts, deployment files, and migration files when relevant.
- Do not use vague placeholders like "various files" or "app code".

Requirements for `Dependencies`:
- List both upstream dependencies and intra-project dependencies.
- State what must already exist before the phase begins.
- Identify blockers caused by unresolved decisions.
- State whether the phase depends on completion of a specific earlier phase.

Requirements for `Risks`:
- State the actual delivery or regression risks for the phase.
- If risk is low, say so and explain briefly.
- If risk is medium or high, identify the main failure modes.

Requirements for `Tests and checks to run`:
- Include exact checks where possible, for example:
  - unit tests
  - integration tests
  - end-to-end tests
  - lint
  - typecheck
  - format check
  - build
  - accessibility checks
  - smoke tests
  - manual UX checks
  - deployment verification
- If exact commands are unknown, use placeholder command patterns such as:
  - `npm test`
  - `npm run lint`
  - `npm run build`
  - `pytest`
  - `cargo test`
  - `[project test command]`
- Only include checks relevant to the phase.

Requirements for `Review check before moving work to \`DONE.md\``:
- This is a strict gate.
- Include:
  - code review concerns
  - requirement traceability
  - regression risk review
  - documentation update check
  - scope creep check
  - check that unfinished follow-up work has been written back to `TODO.md`
- Require the reviewer to confirm that the phase outcome matches the stated goal and scope.

Requirements for `Exact \`TODO.md\` entries to refresh from this phase`:
- Write exact checkbox-ready entries.
- Keep entries atomic, concrete, and reviewable.
- Group them under the phase.
- Each entry must map to a single piece of work that can be verified independently.
- Do not use vague entries such as:
  - "finish feature"
  - "polish app"
  - "wrap up"
- Include test, docs, and verification entries when needed.

Requirements for `Exit criteria for moving items to \`DONE.md\``:
- Make each criterion binary and verifiable.
- Tie each criterion to actual evidence such as:
  - code present in the expected files
  - tests passing
  - build succeeding
  - review completed
  - docs updated
- Do not allow an item to move to `DONE.md` because it is "mostly finished".
- State what must be true before each related `TODO.md` entry can be moved to `DONE.md`.

Requirements for `Review policy`:
- Define the expected review size based on the provided review cadence.
- State when a phase must be split before implementation starts.
- State that oversized phases are not allowed to proceed unchanged.

Requirements for `Definition of done for the plan`:
- Define what must be true for the overall project to be considered complete.
- Include implementation, validation, documentation, and deployment expectations if deployment is in scope.

Requirements for `Open questions`:
- List unresolved decisions that affect implementation quality or sequencing.
- Separate non-blocking open questions from blocking unknowns if needed.

Quality bar:
- Dependency-ordered phases
- Small enough for one review cycle
- Clear primary goal per phase
- Risky work isolated
- Explicit test gates
- Explicit review gates
- Concrete `TODO.md` and `DONE.md` handling
- Concrete expected file paths or path patterns
- No accidental scope creep

Silently self-check before finalizing:
- Are phases dependency-ordered?
- Is each phase small enough for one review cycle?
- Does each phase have a clear goal and binary exit criteria?
- Are risky changes isolated?
- Are tests and review gates explicit?
- Are `TODO.md` and `DONE.md` rules concrete?
- Are file changes concrete enough to guide implementation?
- Did the plan avoid feature creep?

DO NOT FORGET BUILD STEPS.

ALSO:
- think deep!
- check online!
