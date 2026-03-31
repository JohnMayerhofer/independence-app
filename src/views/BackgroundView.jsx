import { FUNDAMENTAL_GOALS, FIRST_PRINCIPLES } from '../config';

export default function BackgroundView() {
  return (
    <div className="background-view">
      <section className="bg-section">
        <h2>Fundamental Goals</h2>
        <p className="bg-intro">
          These six goals represent what we are working toward together — the foundations of a full, independent life.
        </p>
        <div className="goal-pillars">
          {FUNDAMENTAL_GOALS.map((g) => (
            <div key={g.name} className="pillar-card">
              <div className="pillar-name">{g.name}</div>
              <div className="pillar-desc">{g.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-section">
        <h2>Executive Function First Principles</h2>
        <p className="bg-intro">
          Executive function is the set of mental skills that help us plan, focus, and follow through.
          These principles guide how we build every habit and skill in the goal portfolio.
        </p>
        <div className="principles-list">
          {FIRST_PRINCIPLES.map((p) => (
            <div key={p.name} className="principle-card">
              <div className="principle-name">{p.name}</div>
              <div className="principle-desc">{p.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-section">
        <h2>How We Measure Progress</h2>
        <div className="definitions-list">
          <div className="definition-card">
            <div className="def-term status-mastery-text">Mastery</div>
            <div className="def-body">Does this without prompting or coaching consistently — 95% of the time or more.</div>
          </div>
          <div className="definition-card">
            <div className="def-term status-partial-text">Partial</div>
            <div className="def-body">Does this without prompting sometimes, but still often needs coaching.</div>
          </div>
          <div className="definition-card">
            <div className="def-term status-open-text">Open</div>
            <div className="def-body">Does not do this without prompting or coaching except in rare cases.</div>
          </div>
        </div>

        <h3>Importance Levels</h3>
        <div className="definitions-list">
          <div className="definition-card">
            <div className="def-term imp-must-text">Must</div>
            <div className="def-body">Affects health, safety, or financial viability.</div>
          </div>
          <div className="definition-card">
            <div className="def-term imp-should-text">Should</div>
            <div className="def-body">Affects independence.</div>
          </div>
          <div className="definition-card">
            <div className="def-term imp-nice-text">Nice</div>
            <div className="def-body">Has further implications on quality of life.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
