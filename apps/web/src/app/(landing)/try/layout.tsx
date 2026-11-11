import { type ReactNode } from 'react';
import { GuestShell } from './_components/GuestShell';

const TrialLayout = ({ children }: { children: ReactNode }) => <GuestShell>{children}</GuestShell>;

export default TrialLayout;
