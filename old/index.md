Just a reference for my things

### My Packagist packages

{% for package in site.packages %}
- **[{{ package.name }}]({{ package.packagist_url }}){:target="_blank"}**: {{package.description}}  
{% endfor %}



#### By categories
{% for category in site.categories %}
##### {{ category[0] }}

{% for post in category[1] %}
- {{ post.date | date_to_string }} - **[{{ post.title }}]({{ post.url }})** 
{% endfor %}

{% endfor %}

#### By tags
{% for tag in site.tags %}
##### {{ tag[0] }}

{% for post in tag[1] %}
- {{ post.date | date_to_string }} - **[{{ post.title }}]({{ post.url }})** 
{% endfor %}

{% endfor %}
