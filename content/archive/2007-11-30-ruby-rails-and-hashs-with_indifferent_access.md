---
title: "Ruby, Rails and hash's with_indifferent_access"
date: 2007-11-30T00:00:00-08:00
categories:
  - "Ruby"
---

<p class="post-image" style="width:100%;clear:both;"><a href="/images/long_name.jpg" title="Long Names"><img src="/images/long_name.jpg" width="455" height="130" alt="Long Names" /></a></p>
<p>Ruby developers like to be clear in their naming of variables, modules, classes, methods, and so on. I believe this comes from the idea that code should need very few inline comments if it is written clearly and descriptively. This descriptive naming strategy, combined with the decidedly non-English origins of Ruby (Japanese) and Rails (Danish), often result in oddly-named creations such as <code>#execute_query_as_logged_in_user_without_transaction_logging</code> (which I just made up), and <code>#validates_numericality_of</code> (which is real).</p>
<p>A newcomer might find these tongue-twisting, hyper-descriptive naming conventions maddening, but most of the time the intent becomes so much clearer as a result, it becomes infectious; in no time you find yourself writing your own 30-letter, borderline-semantically-correct method names and producing highly maintainable, readable, self-documenting code. That doesn't mean it happens all the time, though...</p>
<p><a id="more"></a><a id="more-122"></a></p>
<p>When I first ran across <code>#with_indifferent_access</code> I had no choice but to look it up as I had no hope of figuring out what it meant. "Indifferent" is how I feel when my wife asks me if I want chicken &amp; snow peas or chicken &amp; broccoli for dinner, not how I feel about ruby hashes. Admittedly, I was a little disappointed then to discover HashWithIndifferentAccess doesn't do much: it just extends a Hash so that you can retrieve values with either string or symbol keys. The Hash is "indifferent" as to which type of key you send it.</p>

```ruby
>> { :first => 'Kevin', :last => 'Hunt' }['last']
=> nil
>> require 'active_support' # Adds with_indifferent_access to Hash
=> true
>> { :first => 'Kevin', :last => 'Hunt' }.with_indifferent_access['last']
=> "Hunt"

```

<p>This appears related to <code>Hash#symbolize_keys</code>, but also converts hashes within the hash.</p>

```ruby
>> { :name => { :first => 'Kevin', :last => 'Hunt' } }['name']['last']
NoMethodError: undefined method `[]' for nil:NilClass
        from (irb):4
>> { :name => { :first => 'Kevin', :last => 'Hunt' } }.with_indifferent_access['name']['last']
=> "Hunt"

```

<h3>Further Reading</h3>
<p><a href="http://api.rubyonrails.org/classes/HashWithIndifferentAccess.html">Rails' HashWithIndifferentAccess docs</a></p>
<h3>Feedback and Article Ideas</h3>
<p>Want to see a topic explored here? <a href="https://twitter.com/kev_in">Send Me a Message</a>.</p>
