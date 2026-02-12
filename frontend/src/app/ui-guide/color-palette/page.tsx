const LEFT_SECTIONS = [
    {
        title: "Base",
        labels: ["base-Dark:", "border:", "sections:"],
        colors: ["#FAF7E6", "#E0E6D9", "#F4F6F1"],
    },
    {
        title: "Accent",
        labels: ["primary accent:", "secondary accent:", "disabled accent:"],
        colors: ["#F6C531", "#D7E9B6", "#91B6A2"],
    },
    {
        title: "Text",
        labels: ["primary text:", "secondary text:", "body text:"],
        colors: ["#1F2E13", "#7A6B3F", "#4B5A41"],
    },
    {
        title: "Neutrals",
        labels: ["001:", "002:", "003:"],
        colors: ["#FAF7E6", "#F1DC9A", "#F6C531"],
    },
];

const RIGHT_SECTIONS = [
    {
        title: "Neutrals",
        items: [
            {
                color: "#FAF7E6",
                name: "001",
                hex: "#FAF7E6",
                rgb: "rgb(250, 247, 230)",
                hsl: "hsl(51, 67, 94)",
            },
            {
                color: "#F1DC9A",
                name: "002",
                hex: "#F1DC9A",
                rgb: "rgb(241, 220, 154)",
                hsl: "hsl(46, 76, 77)",
            },
            {
                color: "#F6C531",
                name: "003",
                hex: "#F6C531",
                rgb: "rgb(246, 197, 49)",
                hsl: "hsl(45, 92, 58)",
            },
        ],
    },
    {
        title: "Base",
        items: [
            {
                color: "#E0E6D9",
                name: "Light/border",
                hex: "#E0E6D9",
                rgb: "rgb(224, 230, 217)",
                hsl: "hsl(88, 21, 88)",
            },
            {
                color: "#FAF7E6",
                name: "Light/base",
                hex: "#FAF7E6",
                rgb: "rgb(250, 247, 230)",
                hsl: "hsl(51, 67, 94)",
            },
            {
                color: "#F4F6F1",
                name: "Light/section",
                hex: "#F4F6F1",
                rgb: "rgb(244, 246, 241)",
                hsl: "hsl(84, 22, 95)",
            },
        ],
    },
    {
        title: "Accent",
        items: [
            {
                color: "#F6C531",
                name: "Light/primary",
                hex: "#F6C531",
                rgb: "rgb(246, 197, 47)",
                hsl: "hsl(45, 92, 58)",
            },
            {
                color: "#D7E9B6",
                name: "Light/secondary",
                hex: "#D7E9B6",
                rgb: "rgb(215, 233, 182)",
                hsl: "hsl(81, 54, 81)",
            },
            {
                color: "#F4F6F1",
                name: "Light/disabled",
                hex: "#91B6A2",
                rgb: "rgb(145, 182, 162)",
                hsl: "hsl(148, 20, 64)",
            },
        ],
    },
    {
        title: "Text",
        items: [
            {
                color: "#1F2E13",
                name: "Light/primary",
                hex: "#1F2E13",
                rgb: "rgb(31, 46, 19)",
                hsl: "hsl(93, 42, 13)",
            },
            {
                color: "#7A6B3F",
                name: "Light/secondary",
                hex: "#7A6B3F",
                rgb: "rgb(122, 107, 63)",
                hsl: "hsl(45, 32, 36)",
            },
            {
                color: "#4B5A41",
                name: "Light/body",
                hex: "#4B5A41",
                rgb: "rgb(75, 90, 65)",
                hsl: "hsl(96, 16, 30)",
            },
        ],
    },
];

function LeftSection({ title, labels, colors }) {
    return (
        <section>
            <h3 className="text-center p-4 text-2xl">{title}</h3>
            <div className="flex flex-row p-4 justify-center">
                <div className="flex flex-col gap-11 pr-6">
                    {labels.map((label, i) => (
                        <p key={i}>{label}</p>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    {colors.map((color, i) => (
                        <div
                            key={i}
                            className="w-[147px] h-[52px] border border-black"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function RightSection({ title, items }) {
    return (
        <section>
            <h2 className="text-3xl">{title}</h2>
            <div className="flex flex-row p-4">
                {items.map((item, i) => (
                    <div key={i} className="p-2">
                        <div
                            className="w-[180px] h-[90px]"
                            style={{ backgroundColor: item.color }}
                        />
                        <p>{item.name}</p>
                        <p>{item.hex}</p>
                        <p>{item.rgb}</p>
                        <p>{item.hsl}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function ColorPalette() {
    return (
        <div className="p-5">
            <h2 className="text-5xl font-bold">Light theme</h2>

            <div className="flex flex-row p-6">
                <div className="flex flex-1 flex-col p-4">
                    {LEFT_SECTIONS.map((section, i) => (
                        <LeftSection key={i} {...section} />
                    ))}
                </div>

                <div className="flex flex-1 p-4">
                    <section>
                        <div>
                            {RIGHT_SECTIONS.map((section, i) => (
                                <RightSection key={i} {...section} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <div>
                <h2>Dark theme</h2>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
