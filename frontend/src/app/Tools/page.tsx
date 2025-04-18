// frontend/src/app/Tools/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

// Static imports—Webpack/Next will bundle these and expose width/height automatically
import tool01 from "./tool_01.png";
import tool02 from "./tool_02.png";
import tool03 from "./tool_03.png";

const tools = [
  {
    slug: "tool1",
    title: "Tool 1",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    img: tool01,
  },
  {
    slug: "tool2",
    title: "Tool 2",
    desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    img: tool02,
  },
  {
    slug: "tool3",
    title: "Tool 3",
    desc: "Duis aute irure dolor in reprehenderit in voluptate.",
    img: tool03,
  },
];

export default function Tools() {
  return (
    <div className={styles.toolsPage}>
      <h1>Tools</h1>
      <p className={styles.subtitle}>
        Browse available tools and their details.
      </p>

      <div className={styles.cards}>
        {tools.map((t) => (
          <Link
            key={t.slug}
            href={`/Tools/${t.slug}`}
            className={styles.card}
          >
            <Image
              src={t.img}
              alt={t.title}
              className={styles.cardImg}
              width={400}
              height={200}
            />
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{t.title}</h2>
              <p className={styles.cardDesc}>{t.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
