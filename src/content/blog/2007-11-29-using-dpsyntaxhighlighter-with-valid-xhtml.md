---
title: "Using dp.SyntaxHighlighter with Valid XHTML"
date: 2007-11-29T00:00:00-08:00
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
