### PHP

- [My Packagist stuff](https://packagist.org/packages/dansan/){:target="_blank"}

---

### GitHub repositories

- [my 3D models](https://github.com/danielsan80?utf8=%E2%9C%93&tab=repositories&q=topic%3A3dprint){:target="_blank"}
- [JobBoy project](https://github.com/danielsan80?utf8=%E2%9C%93&tab=repositories&q=topic%3Ajobboy){:target="_blank"}
- [sf project for learn](https://github.com/danielsan80?utf8=%E2%9C%93&tab=repositories&q=topic%3Asf4-){:target="_blank"}
- [no topics](https://github.com/danielsan80?utf8=%E2%9C%93&tab=repositories&q=topics%3A0+archived%3Afalse){:target="_blank"}

- [forks](https://github.com/danielsan80?utf8=%E2%9C%93&tab=repositories&q=fork%3Aonly+archived%3Afalse){:target="_blank"}
- [old stuff](https://github.com/danielsan80?utf8=%E2%9C%93&tab=repositories&q=topic%3Aold+archived%3Afalse){:target="_blank"}
- [archived](https://github.com/danielsan80?utf8=%E2%9C%93&tab=repositories&q=archived%3Atrue){:target="_blank"}


---

### Blog

{% for tag in site.tags %}
{% if tag[0] == 'highlight' %}
{% for post in tag[1] %}
- {{ post.date | date_to_string }} - **[{{ post.title }}]({{ post.url }})** 
{% endfor %}
{% endif %}
{% endfor %}
- *[...more](/blog/index.md)*

