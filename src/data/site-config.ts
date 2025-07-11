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
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    website: 'https://raulferrergarcia.com',
    title: 'From Tech Lead to AI Expert — One Year, One Mission',
    subtitle: 'Follow my journey learning, building and publishing in Artificial Intelligence — with no excuses.',
    description: 'Tech Lead | PhD | Expanding my impact through Artificial Intelligence — building, learning, and leading in public.',
    image: {
        src: '/preview.jpg',
        alt: 'Raúl Ferrer - An AI Journey'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Projects',
            href: '/projects'
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
        text: "I’m Raúl Ferrer — Tech Lead, PhD, and lifelong learner. After years leading teams and building software products, I’m expanding my expertise into Artificial Intelligence. This isn’t a career switch. It’s a strategic evolution. Over the next 12 months, I’m deepening my technical leadership with AI skills, building real-world projects, and sharing everything I learn — transparently and consistently. If you’re a team leader, product builder or curious learner: follow along. Let’s shape the future with AI together.",
        image: {
            src: '/hero.jpeg',
            alt: 'A person sitting at a desk in front of a computer'
        },
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
