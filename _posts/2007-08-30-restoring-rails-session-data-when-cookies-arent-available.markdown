---
layout: post
status: publish
published: true
title: Restoring Rails session data when cookies aren't available
author:
  display_name: Kev.in
  login: Kevin
  email: kevin@kev.in
  url: http://kev.in
author_login: Kevin
author_email: kevin@kev.in
author_url: http://kev.in
excerpt: ! "<img class=\"alignright\" src=\"{{ site.image_path }}\"
  title=\"C is for Cookie\" alt=\"C is for Cookie\" height=\"125\" width=\"180\" />\r\nIf
  you've ever needed to implement user-friendly upload, you know intimately what a
  pain it is to get right. The web just isn't built for uploading files from a browser.
  I mean, it kinda works, but even then only with a dozen or so limitations. Even
  the major photo and video sites have tried various solutions to make this easier
  for users. So when I built <a href=\"http://dibs.net\">Dibs.net</a>, I decided rather
  quickly to abandon all hope of getting it working flawlessly with plain ol' Javascript
  and HTML, and instead looked into using a fairly nonintrusive Flash uploader component.
  (Without Flash installed, it just falls back to a simple HTML-based file-upload
  form.)\r\n\r\nThat's not to say it was perfectly simple to get working with Rails.
  Because Dibs.net accepts uploads only from logged-in users, I ran into two limitations
  that would not allow me to use this solution:\r\n<ul>\r\n\t<li>Flash doesn't send
  the cookies from the browser (at least it doesn't in Firefox; it might in IE)</li>\r\n\t<li>Rails
  doesn't support non-cookie sessions</li>\r\n</ul>\r\nBecause Flash doesn't send
  the session cookie, Rails thinks the request is coming from a new, logged-out user
  and creates a new session for it. Adding a cookies feature to Flash was well out
  of my hands since I don't work for Adobe, so I looked into a way to restore the
  session from a session key passed as a URL parameter. After some experimentation,
  I found a solution that works great.\r\n\r\n\r\n\r\n\r\n\r\n\r\n"
wordpress_id: 116
wordpress_url: http://railsauthority.com/tutorial/restoring-rails-session-data-when-cookies-arent-available
date: !binary |-
  MjAwNy0wOC0zMCAyMDowNDowMCAtMDcwMA==
date_gmt: !binary |-
  MjAwNy0wOC0zMSAwMzowNDowMCAtMDcwMA==
categories:
- Controllers
- Filters
tags: []
comments:
- id: 13092
  author: Jan
  author_email: spam@janfiete.de
  author_url: ''
  date: !binary |-
    MjAwOC0wNi0xNSAxNTo1MTowOCAtMDcwMA==
  date_gmt: !binary |-
    MjAwOC0wNi0xNSAyMjo1MTowOCAtMDcwMA==
  content: ! 'Hi,


    thanks for the nice solution.


    One remark: I am using active_record_store for the session storage and there find_session
    was not available. I had to use find_by_session_id.


    Cheers,

    Jan'
- id: 14950
  author: Atul Veer
  author_email: atul.veer@gmail.com
  author_url: http://atulveer.wordpress.com
  date: !binary |-
    MjAwOS0wMi0yMiAyMzo1Njo1MyAtMDgwMA==
  date_gmt: !binary |-
    MjAwOS0wMi0yMyAwNzo1Njo1MyAtMDgwMA==
  content: ! "Hi Kevin,\r\n\r\nThanks a lot for this post.\r\n\r\nI am facing same
    issue, however for me requests which are coming from Flash works  95 % of the
    time, WITHOUT any changes to sessions you are suggesting. In some cases it is
    not working (Rails thinks request coming from Flash is a new user request and
    user is redirected to login page.)\r\n\r\nI tried to implement the solution you
    suggested, however setup of my app is different and I am not able to send session_key
    along with the request. I am rendering flash component in a iframe, image submitting
    functionality is handled by the flash component, I dont have a form  in views,
    hence I am not able to send session_key as a parameter.\r\n\r\nCan you please
    explain me how you are integrating flash component? and how the code in views
    works in your case?\r\n\r\nThanks in advance,\r\n- Atul"
- id: 18105
  author: Robb Shecter
  author_email: robb@lclark.edu
  author_url: ''
  date: !binary |-
    MjAwOS0wNS0yMSAxNzowNTozMCAtMDcwMA==
  date_gmt: !binary |-
    MjAwOS0wNS0yMiAwMTowNTozMCAtMDcwMA==
  content: Any idea how this would work in Rails 2.3?
- id: 29164
  author: Tiago
  author_email: tscolari@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMC0wMy0wNSAwNDo1NDo1NyAtMDgwMA==
  date_gmt: !binary |-
    MjAxMC0wMy0wNSAxMjo1NDo1NyAtMDgwMA==
  content: ! "Do you have any idea about how retrieve the session if I'm using mem_cached_store?\r\nBecause
    the DEFAULT_SESSION_OPTIONS[: database_manager] is aways nil for me."
---
<p><img class="alignright" src="{{ site.image_path }}/cookie.jpg" title="C is for Cookie" alt="C is for Cookie" height="125" width="180" /><br />
If you've ever needed to implement user-friendly upload, you know intimately what a pain it is to get right. The web just isn't built for uploading files from a browser. I mean, it kinda works, but even then only with a dozen or so limitations. Even the major photo and video sites have tried various solutions to make this easier for users. So when I built <a href="http://dibs.net">Dibs.net</a>, I decided rather quickly to abandon all hope of getting it working flawlessly with plain ol' Javascript and HTML, and instead looked into using a fairly nonintrusive Flash uploader component. (Without Flash installed, it just falls back to a simple HTML-based file-upload form.)</p>
<p>That's not to say it was perfectly simple to get working with Rails. Because Dibs.net accepts uploads only from logged-in users, I ran into two limitations that would not allow me to use this solution:</p>
<ul>
<li>Flash doesn't send the cookies from the browser (at least it doesn't in Firefox; it might in IE)</li>
<li>Rails doesn't support non-cookie sessions</li>
</ul>
<p>Because Flash doesn't send the session cookie, Rails thinks the request is coming from a new, logged-out user and creates a new session for it. Adding a cookies feature to Flash was well out of my hands since I don't work for Adobe, so I looked into a way to restore the session from a session key passed as a URL parameter. After some experimentation, I found a solution that works great.</p>
<p><a id="more"></a><a id="more-116"></a></p>
<h3>Assumptions</h3>
<p>I use a modified version of the <code><a href="http://technoweenie.stikipad.com/plugins/show/Acts+as+Authenticated">acts_as_authenticated</a></code> plugin. Upon authentication, the plugin sets the <code>:user</code> session key to the authenticated user's <code>id</code>. You'll need to adapt for your own configuration.</p>
<h3>Example Rails Code</h3>
<p class="code-source">In <span class="filename">RAILS_ROOT/app/controllers/show_my_ip_controller.rb</span>:</p>
{% highlight ruby %}
class ImagesController < ApplicationController
	session :off, :only => :create
	prepend_before_filter :restore_session_user_from_param, :only => :create
	requires_login :except => :index

	def create
	  # Handle the file upload here
	end

	private
	def restore_session_user_from_param
	    data = ActionController::CgiRequest::DEFAULT_SESSION_OPTIONS[:database_manager].session_class.find_session( params[:_session_id] ).data
	    sess_obj = Marshal.load( Base64.decode64( data ) )
	    @current_user = User.find( sess_obj[:user] )
  	rescue
    	authorization_required
  	end
end
{% endhighlight %}
<p class="code-source">Then we include the session id as a parameter in the form's action URL in the view:</p>
{% highlight html %}
<form action="<%= images_path(:_session_id => session.session_id) %>" method="post" id="photoupload" enctype="multipart/form-data">
{% endhighlight %}
<h3>How it works</h3>
<p>Under normal circumstances the <code>acts_as_authenticated</code> plugin sets the <code>@current_user</code> instance variable to the current logged-in user at the start of each request. Since we have no session data when a Flash app hits the controller, there's effectively no <code>current_user</code>. Our goal is to get <code>current_user</code> working, so we:</p>
<ul>
<li>turn sessions off for the relevant action; otherwise Rails will create useless sessions any time Flash hits that action</li>
<li>prepend a before filter to set the <code>@current_user</code> instance variable</li>
<li>require login for most of the actions, including <code>create</code></li>
</ul>
<p>In the before_filter, we grab the session data from whatever session store we're using, decode and unmarshall it, and set the @current_user instance variable to the <code>User</code> we find with the <code>id</code> we get from the session hash.</p>
<p>Simple? Not really. But it works!</p>
<h3>Further Reading</h3>
<p>I couldn't find much documentation on any of this beyond stomping through the Rails code &amp; <a href="http://corelib.rubyonrails.org/classes/CGI/Session.html">Ruby's CGI Standard Library docs</a>.</p>
<h3><strong>Update:</strong> A Word of Caution</h3>
<p>I forgot to mention when I published this earlier that there's a reason parameterized sessions is discouraged: browsers will send the entire current link, including the session id, in referer headers to offsite hosts. This doesn't affect Dibs.net's Flash upload, but in other scenarios use the above with caution, or with SSL.</p>
<h3>Feedback and Article Ideas</h3>
<p>Want to see a topic explored here? <a href="/contact">Send Me a Message</a>.</p>
