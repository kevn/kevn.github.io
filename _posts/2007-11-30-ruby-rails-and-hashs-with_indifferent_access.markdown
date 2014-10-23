---
layout: post
status: publish
published: true
title: Ruby, Rails and hash's with_indifferent_access
author:
  display_name: Kev.in
  login: Kevin
  email: kevin@kev.in
  url: http://kev.in
author_login: Kevin
author_email: kevin@kev.in
author_url: http://kev.in
excerpt: ! "<p class=\"post-image\" style=\"width:100%;clear:both;\"><a href=\"{{ site.image_path }}/long_name.jpg\"
  title=\"Long Names\"><img src=\"{{ site.image_path }}/long_name.jpg\"
  width=\"455\" height=\"130\" alt=\"Long Names\" /></a></p>\r\n<p>Ruby developers
  like to be clear in their naming of variables, modules, classes, methods, and so
  on. I believe this comes from the idea that code should need very few inline comments
  if it is written clearly and descriptively. This descriptive naming strategy, combined
  with the decidedly non-English origins of Ruby (Japanese) and Rails (Danish), often
  result in oddly-named creations such as <code>#execute_query_as_logged_in_user_without_transaction_logging</code>
  (which I just made up), and <code>#validates_numericality_of</code> (which is real).</p>\r\n<p>A
  newcomer might find these tongue-twisting, hyper-descriptive naming conventions
  maddening, but most of the time the intent becomes so much clearer as a result,
  it becomes infectious; in no time you find yourself writing your own 30-letter,
  borderline-semantically-correct method names and producing highly maintainable,
  readable, self-documenting code. That doesn't mean it happens all the time, though...</p>\r\n\r\n\r\n\r\n"
wordpress_id: 122
wordpress_url: http://railsauthority.com/tutorial/ruby-rails-and-hashs-with_indifferent_access
date: !binary |-
  MjAwNy0xMS0zMCAxNzozMTo1OCAtMDgwMA==
date_gmt: !binary |-
  MjAwNy0xMi0wMSAwMDozMTo1OCAtMDgwMA==
categories:
- Ruby
tags: []
comments:
- id: 18864
  author: Jordan Ritter
  author_email: jpr5@darkridge.com
  author_url: ''
  date: !binary |-
    MjAwOS0wNi0wOSAwOToxMzo0NyAtMDcwMA==
  date_gmt: !binary |-
    MjAwOS0wNi0wOSAxNzoxMzo0NyAtMDcwMA==
  content: ! "I agree that good code shouldn't require a lot of inline comments, but
    it's also true that one of the most common causes of software bugs is that the
    code doesn't do what was intended.  \r\n\r\nIn reality this isn't really a symptom
    of the naming conventions failing to convey intention, but rather a failure of
    the developer to properly decide what the intent should have been in the first
    place, and describe it in a (succinct) way that would give both themselves and
    others an easy means to confirm \"does this code do what it was intended to do.\"\r\n\r\nSimilarly,
    TDD gets you closer to solving the symptom, but that's only as good as the tests
    you write and maintain, and it still falls short because, while it conveys behavioural
    (input/output) intent, for any reasonably complex task/function it still doesn't
    describe *how* the logic that arrives at a given result should work.\r\n\r\nBottom
    line: there still aren't any good substitutes for commenting logic, despite the
    prevailing consensus in the Ruby community that the code is the documentation."
---
<p class="post-image" style="width:100%;clear:both;"><a href="{{ site.image_path }}/long_name.jpg" title="Long Names"><img src="{{ site.image_path }}/long_name.jpg" width="455" height="130" alt="Long Names" /></a></p>
<p>Ruby developers like to be clear in their naming of variables, modules, classes, methods, and so on. I believe this comes from the idea that code should need very few inline comments if it is written clearly and descriptively. This descriptive naming strategy, combined with the decidedly non-English origins of Ruby (Japanese) and Rails (Danish), often result in oddly-named creations such as <code>#execute_query_as_logged_in_user_without_transaction_logging</code> (which I just made up), and <code>#validates_numericality_of</code> (which is real).</p>
<p>A newcomer might find these tongue-twisting, hyper-descriptive naming conventions maddening, but most of the time the intent becomes so much clearer as a result, it becomes infectious; in no time you find yourself writing your own 30-letter, borderline-semantically-correct method names and producing highly maintainable, readable, self-documenting code. That doesn't mean it happens all the time, though...</p>
<p><a id="more"></a><a id="more-122"></a></p>
<p>When I first ran across <code>#with_indifferent_access</code> I had no choice but to look it up as I had no hope of figuring out what it meant. "Indifferent" is how I feel when my wife asks me if I want chicken &amp; snow peas or chicken &amp; broccoli for dinner, not how I feel about ruby hashes. Admittedly, I was a little disappointed then to discover HashWithIndifferentAccess doesn't do much: it just extends a Hash so that you can retrieve values with either string or symbol keys. The Hash is "indifferent" as to which type of key you send it.</p>
{% highlight ruby %}
>> { :first => 'Kevin', :last => 'Hunt' }['last']
=> nil
>> require 'active_support' # Adds with_indifferent_access to Hash
=> true
>> { :first => 'Kevin', :last => 'Hunt' }.with_indifferent_access['last']
=> "Hunt"
{% endhighlight %}
<p>This appears related to <code>Hash#symbolize_keys</code>, but also converts hashes within the hash.</p>
{% highlight ruby %}
>> { :name => { :first => 'Kevin', :last => 'Hunt' } }['name']['last']
NoMethodError: undefined method `[]' for nil:NilClass
        from (irb):4
>> { :name => { :first => 'Kevin', :last => 'Hunt' } }.with_indifferent_access['name']['last']
=> "Hunt"
{% endhighlight %}
<h3>Further Reading</h3>
<p><a href="http://api.rubyonrails.org/classes/HashWithIndifferentAccess.html">Rails' HashWithIndifferentAccess docs</a></p>
<h3>Feedback and Article Ideas</h3>
<p>Want to see a topic explored here? <a href="https://twitter.com/{{ site.twitter_username }}">Send Me a Message</a>.</p>
