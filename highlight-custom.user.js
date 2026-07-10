// ==UserScript==
// @name                highlight-custom
// @name:zh-CN          高亮关键词(自定义版)
// @description         Highlight custom keywords on any website
// @description:zh-CN   在任意网站高亮自定义关键词
// @version             2.1.0
// @author              Custom
// @license             MIT
// @include             http://*
// @include             https://*
// @run-at              document-end
// @namespace           highlight-custom
// ==/UserScript==

(function() {
    'use strict';

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const DEFAULT_CONFIG = {
        sites: {
            '.*': [
                { str: 'react', title: 'React框架', color: '#61DAFB' },
                { str: 'vue', title: 'Vue框架', color: '#488d6e' },
                { str: 'javascript', title: 'JavaScript', color: '#F7DF1E' },
                { str: 'python', title: 'Python', color: '#3776AB' },
                { str: '数据', title: '数据相关', color: '#FF6B6B' },
                { str: 'AI', title: '人工智能', color: '#A855F7' },
                { str: '爬虫', title: '爬虫技术', color: '#22C55E' },
                { str: '限免', title: '限时免费', color: '#F97316' },
            ]
        },
        defaultColor: '#FFDA5E',
        defaultTextColor: 'black'
    };

    class KeywordService {
        static init(href) {
            KeywordService.keywords = [];
            const sites = Object.keys(DEFAULT_CONFIG.sites);
            
            if (!sites || !sites.length) return;
            
            sites.forEach((site) => {
                try {
                    const sitePattern = new RegExp(site, 'gi');
                    if (sitePattern.test(href)) {
                        KeywordService.keywords.push(...DEFAULT_CONFIG.sites[site]);
                    }
                } catch (e) {
                    console.warn('Invalid site pattern:', site);
                }
            });
        }

        static list() {
            return Promise.resolve(KeywordService.keywords);
        }
    }

    class TextElement {
        constructor(element) {
            this.element = element;
            this.innerText = element.textContent;
            this.shouldHighlight = false;
        }

        highlight(config) {
            const childNodes = Array.from(this.element.childNodes);
            
            if (TextElement.keywords.length === 0) return;
            
            const combinedPattern = new RegExp(
                TextElement.keywords.map(kw => escapeRegExp(kw.str)).join('|'),
                'gi'
            );

            for (let i = 0; i < childNodes.length; i++) {
                const node = childNodes[i];

                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;

                    if (combinedPattern.test(text)) {
                        this.shouldHighlight = true;
                        combinedPattern.lastIndex = 0;

                        const highlightedText = text.replace(
                            combinedPattern,
                            (match) => {
                                const keyword = TextElement.keywords.find(kw => 
                                    new RegExp('^' + escapeRegExp(kw.str) + '$', 'i').test(match)
                                );
                                if (keyword) {
                                    return `<mark style="background-color: ${keyword.color || config.defaultColor}; color: ${config.defaultTextColor};" title="${keyword.title}">${match}</mark>`;
                                }
                                return match;
                            }
                        );

                        const tempElement = document.createElement('span');
                        tempElement.innerHTML = highlightedText;
                        node.parentNode.replaceChild(tempElement, node);
                        childNodes.splice(i, 1, ...Array.from(tempElement.childNodes));
                        i += tempElement.childNodes.length - 1;
                    }
                }
            }

            if (this.shouldHighlight) {
                this.element.dataset.highlighted = 'true';
            }
        }

        static setKeywords(keywords) {
            TextElement.keywords = keywords;
        }

        static findAll() {
            return TextElement.targetTagNames.reduce((res, tagName) => {
                const tags = document.getElementsByTagName(tagName);
                const elements = [];
                for (let i = 0; i < tags.length; i++) {
                    elements.push(new TextElement(tags[i]));
                }
                return res.concat(elements);
            }, []);
        }
    }

    TextElement.targetTagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'pre', 'blockquote', 'summary', 'div', 'span'];

    let highlightedCount = 0;

    function highlight() {
        const elements = TextElement.findAll();
        
        KeywordService.list().then((keywords) => {
            TextElement.setKeywords(keywords);
            elements.forEach((e) => {
                if (!e.element.dataset.highlighted) {
                    e.highlight(DEFAULT_CONFIG);
                }
            });
            highlightedCount = elements.length;
        });
    }

    function init() {
        const href = window.location.href;
        KeywordService.init(href);
        highlight();
        window.addEventListener('scroll', highlight);
    }

    init();
})();