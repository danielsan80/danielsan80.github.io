### PHP

- [My Packagist stuff](https://packagist.org/packages/dansan/){:target="_blank"}

---

### GitHub repositories

- [My 3D models](https://github.com/danielsan80?utf8=%E2%9C%93&tab=repositories&q=topic%3A3dprint){:target="_blank"}
- [JobBoy](https://github.com/danielsan80?utf8=%E2%9C%93&tab=repositories&q=topic%3Ajobboy){:target="_blank"}


---

### Blog

{% for tag in site.tags %}
{% if tag[0] == 'highlight' %}
{% for post in tag[1] %}
- {{ post.date | date_to_string }} - **[{{ post.title }}]({{ post.url }})** 
{% endfor %}
{% endfor %}

[more](/blog/index.md)

