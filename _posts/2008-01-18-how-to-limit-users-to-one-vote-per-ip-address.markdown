---
layout: post
status: publish
published: true
title: How to limit users to one vote per IP address
author:
  display_name: Kev.in
  login: Kevin
  email: kevin@kev.in
  url: http://kev.in
author_login: Kevin
author_email: kevin@kev.in
author_url: http://kev.in
wordpress_id: 123
wordpress_url: http://railsauthority.com/tutorial/how-to-limit-users-to-one-vote-per-ip-address
date: !binary |-
  MjAwOC0wMS0xOCAwOTo1Mjo1MiAtMDgwMA==
date_gmt: !binary |-
  MjAwOC0wMS0xOCAxNjo1Mjo1MiAtMDgwMA==
categories:
- Controllers
- Models
- Migrations
tags: []
comments: []
---
<p>A reader <strong>Aaron J.</strong> <a href="/2007/08/26/how-to-obtain-the-ip-address-of-the-current-user.html#comment-6">writes</a> in response to the short article <a href="/2007/08/26/how-to-obtain-the-ip-address-of-the-current-user.html">How to obtain the IP address of the current user</a>:</p>
<blockquote><p>Do you have any advice on how I can take this a step further? I am looking to limit a given user to one vote per session but I'm not sure how to achieve this. I'd appreciate any help you can offer. Thanks for your time.</p></blockquote>
<p>Good question, Aaron. Remember that a session is simply tied to your browser cookie, so if we allow one vote per session, all the user has to do is clear their cookies and then vote again. And again. And again! So I think what you mean is how do we allow only one vote per IP address? To enforce that, we'll need to save a list of the IP addresses that have already sent us a vote. And before we record a vote, we need to make sure their IP address isn't already on that list. Further, we should remember which poll number they have voted in so we can have more than one poll in our application. We're going to need a simple table:</p>
{% highlight ruby %}
# lib/db/migrate/001_voter_log.rb
create_table :vote_log do |t|
  t.column :poll_id, :integer
  t.column :client_ip, :string
end
{% endhighlight %}
<p>For simplicity of this example, we'll put all of our logic in the controller. (I won't show the VoteLog model class because it's empty.)</p>
{% highlight ruby %}
# RAILS_ROOT/app/controllers/poll_controller.rb
def record_a_vote
  poll_id = params[:poll_id]
  client_ip = request.remote_ip

  unless VoteLog.count(:all, :conditions => ['poll_id = ? AND client_ip = ?', poll_id, client_ip]) == 0
    redirect_to :already_voted
  end

  Poll.find(poll_id).record_vote(params[:candidate]) # Or however you count votes
  VoteLog.create(:poll_id => poll_id, :client_ip => client_ip)
end

def already_voted
  render :text => "You already voted, no cheating!"
end
{% endhighlight %}
<p>Just keep in mind this approach might not be appropriate in all situations. Due to Network Address Translation (NAT) firewalls, many thousands of people will appear to have the same client_ip. This is particularly true in corporate environments. If that's a concern, you'll need to go with a full-blown registered-user approach.</p>
<h3>Further Reading</h3>
<p><a href="{% post_url 2007-08-26-how-to-obtain-the-ip-address-of-the-current-user %}">How to obtain the IP address of the current user</a></p>
<h3>Feedback and Article Ideas</h3>
<p>Want to see a topic explored here? <a href="https://twitter.com/{{ site.twitter_username }}">Send Me a Message</a>.</p>
