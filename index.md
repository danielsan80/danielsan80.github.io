### PHP

- [My Packagist stuff](https://packagist.org/packages/dansan/){:target="_blank"}

---

### GitHub repositories

{% for repo in site.github_repos %}
{% if repo.home %}
{{repo}}
{% endif %}
{% endfor %}

*[...more](/github/index.md)*

---

### Blog

{% for post in site.posts %}{% if post.home %}
- {{ post.date | date_to_string }} - **[{{ post.title }}]({{ post.url }})**{% endif %}{% endfor %}

*[...more](/blog/index.md)*

