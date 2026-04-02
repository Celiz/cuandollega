export const IconChevron = ({ open }: { open: boolean }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
