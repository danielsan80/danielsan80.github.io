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

### Blog

{% for post in site.posts %}{% if post.home %}
- {{ post.date | date_to_string }} - **[{{ post.title }}]({{ post.url }})**{% endif %}{% endfor %}

*[...more](/blog/index.md)*

