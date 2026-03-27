export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    website: string;
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    casestudiesPerPage?: number;
};

const siteConfig: SiteConfig = {
    website: 'https://raulferrergarcia.com',
    title: 'Reliable Enterprise AI Systems',
    subtitle: 'Architecture, failure modes, and evaluation strategies for real-world AI systems.',
    description: 'Software Architect focused on AI systems reliability, evaluation, and enterprise architecture.',
    image: {
        src: '/preview.jpg',
        alt: 'Reliable Enterprise AI Systems'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Case Studies',
            href: '/casestudies'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        },
        {
            text: 'Terms',
            href: '/terms'
        }
    ],
    socialLinks: [
        {
            text: 'Linkedin',
            href: 'https://www.linkedin.com/in/raulferrergarcia/'
        },
        {
            text: 'X/Twitter',
            href: 'https://twitter.com/raulferrerdev'
        }
    ],
    hero: {
        text: `I’m Raúl Ferrer — a software architect focused on AI systems reliability.

Most AI systems today are not engineered — they are assembled.
They work in demos, but fail in production due to poor evaluation, lack of observability, and fragile architectures.

This site explores those failures.

I analyze how AI systems behave under real-world conditions:
- Noisy and evolving data.
- Latency and cost constraints.
- Non-deterministic outputs.
- Degradation over time.

The goal is simple:

Understand why AI systems fail — and how to design them to be reliable.`,
        image: {
            src: '/hero.jpeg',
            alt: 'AI system architecture visualization'
        }
    },
    postsPerPage: 8,
    casestudiesPerPage: 8
};

export default siteConfig;
