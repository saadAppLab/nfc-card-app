interface MarqueeProps {
    items: string[];
    speed?: number;
    repeat?: number; // optional custom repeat
}

export default function Marquee({
    items,
    speed = 15,
    repeat = 10, // default 10 times
}: MarqueeProps) {

    // Repeat items multiple times
    const repeatedItems = Array.from({ length: repeat }, () => items).flat();

    return (
        <div className="marquee-wrapper">
            <div
                className="marquee-track"
                style={{ animationDuration: `${speed}s` }}
            >
                {repeatedItems.map((item, index) => (
                    <span key={index}>{item}</span>
                ))}
            </div>
        </div>
    );
}
