export type Category = {
    title: string;
    content: string[];
    contentNested: NestedItem[];
    type: string;
};

export type NestedItem = {
    title: string;
    content: string[];
};

export type Data = Category[];

const data: Data = [
    {
        title: 'Product Status',
        content: ['All','Active','Upcoming'],
        contentNested: [],
        type: 'regular',
    },
    {
        title: 'Product Status',
        content: ['Featured', 'Newest'],
        contentNested: [],
        type: 'regular',
    },
    {
        title: 'Countries',
        content: [''],
        contentNested: [],
        type: 'regular',
    },
    /*{
        title: 'Paragraph',
        content: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        ],
        contentNested: [],
        type: 'regular',
    },
    {
        title: 'Nested Accordion',
        content: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        ],
        contentNested: [
            {
                title: 'Nested 1',
                content: ['Content Nested 1', 'Content Nested 2', 'Content Nested 3'],
            },
            {
                title: 'Nested 2',
                content: ['Content Nested 1', 'Content Nested 2', 'Content Nested 3'],
            },
        ],
        type: 'nested',
    },*/
];

export default data;
