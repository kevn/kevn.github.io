---
layout: post
status: publish
published: true
title: Using dp.SyntaxHighlighter with Valid XHTML
author:
  display_name: Kev.in
  login: Kevin
  email: kevin@kev.in
  url: http://kev.in
author_login: Kevin
author_email: kevin@kev.in
author_url: http://kev.in
excerpt: ! "<p>Over at <a href=\"http://railsauthority.com\">Rails Authority</a> I
  use a great client-side syntax highlighter called <a href=\"http://code.google.com/p/syntaxhighlighter/\">SyntaxHighlighter</a>
  to make code examples look nice, but it doesn't <a href=\"http://groups.google.com/group/syntaxhighlighter/browse_thread/thread/e6dac1c90d8faaa1/df95d0e0c7d63ca9\">support</a>
  <a href=\"http://groups.google.com/group/syntaxhighlighter/browse_thread/thread/a8a8edd03b905020/2ac5b2ad8cf3f7ee\">Valid
  XHTML</a> , so I enhanced it to handle an XHTML-compatible style, e.g.:\r\n<pre
  name=\"code\" class=\"xml:nocontrols:nogutter\">&lt;pre>\r\n  &lt;code class=\"code
  xml:nogutter\">\r\n    Your IP address is &lt;%= @client_ip %&gt;\r\n  &lt;/code>\r\n&lt;/pre></pre>\r\n(Inspired
  by Ernest's post, linked above.)\r\n</p>\r\n\r\n\r\n\r\n\r\n\r\n"
wordpress_id: 78
wordpress_url: http://kev.in/2007/11/29/using-dpsyntaxhighlighter-with-valid-xhtml/
date: !binary |-
  MjAwNy0xMS0yOSAxNzoyMzozNyAtMDgwMA==
date_gmt: !binary |-
  MjAwNy0xMS0zMCAwMToyMzozNyAtMDgwMA==
categories:
- Coding
- Internet
tags: []
comments: []
---

Over at [Rails Authority][railsauthority] I use a great client-side syntax highlighter called <a href="http://code.google.com/p/syntaxhighlighter/">SyntaxHighlighter</a> to make code examples look nice, but it doesn't <a href="http://groups.google.com/group/syntaxhighlighter/browse_thread/thread/e6dac1c90d8faaa1/df95d0e0c7d63ca9">support</a> <a href="http://groups.google.com/group/syntaxhighlighter/browse_thread/thread/a8a8edd03b905020/2ac5b2ad8cf3f7ee">Valid XHTML</a> , so I enhanced it to handle an XHTML-compatible style, e.g.:
{% highlight html %}
  <code class="code xml:nogutter">
    Your IP address is <%= @client_ip %>
  </code>
{% endhighlight %}
<p>(Inspired by Ernest's post, linked above.)</p>
<p><a id="more"></a><a id="more-78"></a></p>
<p>To make this work, I made three changes to the shCore.js file (all within the HighlightAll function):</p>
<ol>
<li> In FindTagsByName, change line 618 that says:
{% highlight js %}
  if(tags[i].getAttribute('name') == name)
{% endhighlight %}
<p>... to:</p>
{% highlight ruby %}
 if(tags[i].getAttribute('name') == name || tags[i].className.indexOf(name)==0)
 {% endhighlight %}
</li>
<li>
Down a few lines at line 627, insert another FindByTags call for 'code':</p>
{% highlight js %}
  FindTagsByName(elements, name, 'code'); // Add this line
  FindTagsByName(elements, name, 'pre');
  FindTagsByName(elements, name, 'textarea');
{% endhighlight %}
</li>
<li>
Further down, at line ~ 657 insert this right before <code>options = options.split(':');</code>:</p>
{% highlight js %}
  options = options.replace(new RegExp("^"+name+"\s"), ''); // Turn 'code ruby:option1:option2' into 'ruby:option1:option2'
{% endhighlight %}
</li>
</ol>
<p>This should be backward-compatible with the existing pre and textarea methods.</p>
<p>And here's the diff of the above steps:</p>
<code>$ diff shCore.js.orig shCore.js</code>
{% highlight diff %}
618c618
<                       if(tags[i].getAttribute('name') == name)
---
>                       if(tags[i].getAttribute('name') == name || tags[i].className.indexOf(name)==0)
627a628
>       FindTagsByName(elements, name, 'code');
657a659
>               options = options.replace(new RegExp("^"+name+"\s"), ''); // Turn 'dp-hilite ruby:option1:option2' into 'ruby:option1:option2'
{% endhighlight %}

[railsauthority]:  http://railsauthority.com
