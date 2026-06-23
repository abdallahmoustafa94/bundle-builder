import type { FunctionComponent, SVGProps } from 'react';
import CameraIcon from '../../assets/icons/camera.svg?react';
import PlanIcon from '../../assets/icons/plan.svg?react';
import SensorIcon from '../../assets/icons/sensor.svg?react';
import ProtectionIcon from '../../assets/icons/protection.svg?react';

type IconComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

/** Step icons keyed by the step's domain id (a presentation concern, not catalog data). */
const ICON_BY_STEP_ID: Record<string, IconComponent> = {
  cameras: CameraIcon,
  plan: PlanIcon,
  sensors: SensorIcon,
  protection: ProtectionIcon,
};

interface StepIconProps {
  stepId: string;
  className?: string;
}

export function StepIcon({ stepId, className }: StepIconProps) {
  const Icon = ICON_BY_STEP_ID[stepId] ?? CameraIcon;
  return <Icon className={className} aria-hidden focusable={false} />;
}
