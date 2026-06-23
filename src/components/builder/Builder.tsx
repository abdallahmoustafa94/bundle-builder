import { useState } from 'react';
import { useBundle } from '../../store/bundleContext';
import { AccordionStep } from './AccordionStep';

// Step 1 opens on load to match the design; mobile starts fully collapsed for
// the Figma review-first flow.
function initialOpenStepId(firstStepId: string | undefined): string | null {
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  return isMobile ? null : firstStepId ?? null;
}

export function Builder() {
  const { catalog } = useBundle();
  const [openStepId, setOpenStepId] = useState<string | null>(() =>
    initialOpenStepId(catalog.steps[0]?.id),
  );

  const toggle = (id: string) => setOpenStepId((current) => (current === id ? null : id));
  const openNext = (index: number) => {
    const next = catalog.steps[index + 1];
    setOpenStepId(next ? next.id : null);
  };

  return (
    <div>
      <div className="flex flex-col gap-0 md:gap-[13px]">
        {catalog.steps.map((step, index) => (
          <AccordionStep
            key={step.id}
            step={step}
            open={openStepId === step.id}
            onToggle={() => toggle(step.id)}
            onNext={() => openNext(index)}
          />
        ))}
      </div>
    </div>
  );
}

