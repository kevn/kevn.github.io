---
title: "How to obtain the IP address of the current user"
date: 2007-08-26T00:00:00-08:00
---

<p><img class="alignright" src="{{ site.image_path }}/address.jpg" title="Some house address" alt="Some house address" height="88" width="160" /></p>
<p>Web applications can receive requests directly, via a CGI process, through proxy servers, relayed from front-end web servers, and so on. This can complicate how you might find out where the request originated if you, for example, wanted to limit an online poll to one vote per IP address. Luckily, Rails consolidates most of the ways to get this info into a single convenience method on the <code>request</code> object for us.</p>
<p><a id="more"></a><a id="more-113"></a></p>
<h3>The Convenience Method: <code>#remote_ip</code></h3>
<p>Without the <code>request.remote_ip</code> method, you'd have to look for specific headers that are used to carry this data in the HTTP request beyond the server where the actual client's connection was terminated.</p>
<p>Rails' <code>request.remote_ip</code> method is pretty smart: it looks for and parses the headers <code>HTTP_CLIENT_IP</code>, <code>HTTP_X_FORWARDED_FOR</code> and <code>REMOTE_ADDR</code> and parse the value which are commonly used for this purpose.</p>
<h3>Example Rails Code</h3>
<p class="code-source">In <span class="filename">RAILS_ROOT/app/controllers/show_my_ip_controller.rb</span>:</p>

```ruby
class ShowMyIpController > ApplicationController

  def index
    @client_ip = request.remote_ip
  end

end

```

<p class="code-source">In <span class="filename">RAILS_ROOT/app/views/show_my_ip/index.html.erb</span>:</p>

```html
Your IP address is <%= @client_ip >

```

<h3>Further Reading</h3>
<p>The <code>request.remote_ip</code> method is documented in the <a href="http://api.rubyonrails.org/classes/ActionController/AbstractRequest.html#M000235">Rails Framework rdocs</a>.</p>
<h3>Feedback and Article Ideas</h3>
<p>Want to see a topic explored here? <a href="https://twitter.com/kev_in">Send Me a Message</a>.</p>
