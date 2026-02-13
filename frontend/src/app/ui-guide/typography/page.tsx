// -----------------------------
// TYPOGRAPHY DATA
// -----------------------------

const TYPOGRAPHY_STYLES = [
    { label: "H1", size: "64px/140%" },
    { label: "H1 Bold", size: "64px/140%" },
    { label: "H2", size: "48px/140%" },
    { label: "H2 Bold", size: "48px/140%" },
    { label: "H3", size: "33px/140%" },
    { label: "H3 Bold", size: "33px/140%" },
    { label: "H4", size: "28px/140%" },
    { label: "H4 Bold", size: "28px/140%" },
    { label: "H5", size: "23px/140%" },
    { label: "H5 Bold", size: "23px/140%" },
    { label: "Title 1", size: "20px/140%" },
    { label: "Title 1 Bold", size: "20px/140%" },
    { label: "Tiltle 2", size: "18px/140%" },
    { label: "Title 2 Bold", size: "18px/140%" },
    { label: "Body", size: "15px/140%" },
    { label: "Body Bold", size: "15px/140%" },
    { label: "Caption", size: "13px/140%" },
    { label: "Caption Bold", size: "13px/140%" },
];

// -----------------------------
// TYPOGRAPHY BLOCK
// -----------------------------

function TypographyBlock({ label, size }) {
    const fontSize = size.split("/")[0];
    const isBold = label.includes("Bold");

    return (
        <div className="flex flex-col items-start gap-1 mb-8">
            <div className="flex flex-col items-start">
                <span className="font-bold">{label}</span>
                <span>Plus Jakarta Sans Regular</span>
                <span>{size}</span>
            </div>

            <p
                style={{ fontSize }}
                className={`${isBold ? "font-bold" : "font-normal"} ml-35`}
            >
                The quick brown fox jumps over the lazy dog.
            </p>
        </div>
    );
}

// -----------------------------
// PAGE
// -----------------------------

export default function TypographyPage() {
    return (
        <div>
            <h1 className='text-7xl text-center p-8 border-b'>TYPOGRAPHY</h1>

            <div className="p-8">
                {TYPOGRAPHY_STYLES.map((style, index) => (
                    <TypographyBlock key={index} {...style} />
                ))}
            </div>
        </div>
    );
}
