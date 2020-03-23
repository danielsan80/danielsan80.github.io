---
title:  "Blog"
---


{% for category in site.categories %}
### {{ category[0] }}

{% for post in category[1] %}
####{{ post.date | date_to_string }} - **[{{ post.title }}]({{ post.url }})**
{% for tag in site.tags %}
{% for postByTag in tag[1] %}
[{{ tag[0] }}]
{% end for %}
{% end for %}
{% end for %}
{% end for %}