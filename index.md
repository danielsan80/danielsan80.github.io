### PHP

- [My Packagist stuff](https://packagist.org/packages/dansan/){:target="_blank"}

---

### GitHub repositories

{% for section in site.github_repo_sections %}
{% if section.home %}
{{section}}
{% endif %}
{% endfor %}

*[...more](/github/index.md)*

---

### Blog [wip]

Everything can be a repo... so these are my [blog posts](https://github.com/danielsan80?utf8=%E2%9C%93&tab=repositories&q=topic%3Apost){:target="_blank"}.

**deprecated:**
{% for post in site.posts %}{% if post.home %}
- {{ post.date | date_to_string }} - **[{{ post.title }}]({{ post.url }})**{% endif %}{% endfor %}

*[...more](/blog/index.md)*

