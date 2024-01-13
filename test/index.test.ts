import genNav from "../src/index"
import { describe, expect, it } from 'vitest'


describe("genNav", () => {
    it("should generate the correct nav and sidebar", () => {
        const option = { baseurl: "./tree" }
        const expectedNav = [
            {
                text: "tree1",
                items: [
                    {
                        text: "file1",
                        link: "tree/tree1/file1.md",
                    }, {
                        text: "tree1-1",
                        link: "tree/tree1/tree1-1/file1-1.md",
                    }
                ],
            }, {
                text: "tree2",
                items: [
                    {
                        text: "file2",
                        link: "tree/tree2/file2.md",
                    }
                ],
            }
        ]
        const expectedSidebar = {
            "tree/tree1": [
                {
                    text: "other",
                    items: [
                        {
                            text: "file1",
                            link: "tree/tree1/file1.md",
                        }
                    ],
                }, {
                    text: "tree1-1",
                    items: [
                        {
                            text: "file1-1",
                            link: "tree/tree1/tree1-1/file1-1.md",
                        }, {
                            text: "file1-1-1",
                            link: "tree/tree1/tree1-1/tree1-1-1/file1-1-1.md",
                        }
                    ],
                }
            ],
            "tree/tree2": [
                {
                    text: "other",
                    items: [
                        {
                            text: "file2",
                            link: "tree/tree2/file2.md",
                        }
                    ],
                }
            ],
        }

        const { nav, sidebar } = genNav(option)

        expect(nav).toEqual(expectedNav)
        expect(sidebar).toEqual(expectedSidebar)
    })
})