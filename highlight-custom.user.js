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
            // 只获取元素本身的直接文本内容（不包含子元素）
            const directText = Array.from(this.element.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent)
                .join('');
            
            for (const keyword of TextElement.keywords) {
                const keywordPattern = new RegExp(keyword.str, 'gi');
                if (keywordPattern.test(directText)) {
                    this.shouldHighlight = true;
                    this.element.style.backgroundColor = keyword.color || config.defaultColor;
                    this.element.style.color = config.defaultTextColor;
                    this.element.setAttribute('title', keyword.title);
                    this.element.dataset.highlighted = 'true';
                    break;
                }
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

    TextElement.targetTagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'pre', 'blockquote', 'summary', 'div'];

    let highlightedCount = 0;

    function highlight() {
        const elements = TextElement.findAll();
        
        if (elements.length === highlightedCount) return;
        
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