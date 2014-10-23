---
layout: post
status: publish
published: true
title: De-tangling attr_reader, attr_writer and attr_accessor from attr_protected
  & attr_accessible (Part 1)
author:
  display_name: Kev.in
  login: Kevin
  email: kevin@kev.in
  url: http://kev.in
author_login: Kevin
author_email: kevin@kev.in
author_url: http://kev.in
excerpt: ! "<img class=\"alignright\" src=\"{{ site.image_path }}/274334_6040.jpg\"
  title=\"Car crash\" alt=\"Car crash\" height=\"107\" width=\"160\" />What a mess.
  You have undoubtedly run across these methods sprinkled throughout the Ruby and
  Rails world. If you've been working with Rails for even a short time, you've probably
  read a little about security and <code>attr_accessible</code>. But do you really
  understand what each of them do and when to use them?\r\nI'm not a fan of whoever
  made these methods so closely named, especially because they serve very different
  purposes: two are specific to Rails (or more accurately, ActiveRecord), while the
  other three are Ruby core methods. When I have a need for any of them, I still have
  to really think about which one I actually want to use. Often I still have to glance
  at the rdocs to be reassured my choice is the right one. So let's dive in and figure
  out what the heck these are supposed to do, and when to use them.\r\n\r\n\r\n\r\n\r\n\r\n"
wordpress_id: 114
wordpress_url: http://railsauthority.com/tutorial/de-tangling-attr_reader-attr_writer-and-attr_accessor-from-attr_protected-attr_accessible-part-1
date: !binary |-
  MjAwNy0wOC0yNyAxODowMDo0OSAtMDcwMA==
date_gmt: !binary |-
  MjAwNy0wOC0yOCAwMTowMDo0OSAtMDcwMA==
categories:
- Models
- Ruby
tags: []
comments:
- id: 13091
  author: Made By Many &raquo; Blog Archive &raquo; Rails Security Auditing
  author_email: ''
  author_url: http://www.madebymany.co.uk/rails-security-auditing-00215
  date: !binary |-
    MjAwOC0wOC0yMSAwNjo0NDo1NiAtMDcwMA==
  date_gmt: !binary |-
    MjAwOC0wOC0yMSAxMzo0NDo1NiAtMDcwMA==
  content: ! '[...] I&#8217;ve saved the most common security flaw until last, not
    using attr_accessor and attr_protected correctly (or not using them at [...]'
- id: 17440
  author: Arsenalist
  author_email: zarars@gmail.com
  author_url: http://raptorsrepublic.com
  date: !binary |-
    MjAwOS0wNS0wNiAxMToxMjozNCAtMDcwMA==
  date_gmt: !binary |-
    MjAwOS0wNS0wNiAxOToxMjozNCAtMDcwMA==
  content: This helped a lot.  Thanks.
- id: 21030
  author: The Viking
  author_email: brandon.hays@gmail.com
  author_url: ''
  date: !binary |-
    MjAwOS0wNy0wNyAyMTo0MzoxOCAtMDcwMA==
  date_gmt: !binary |-
    MjAwOS0wNy0wOCAwNTo0MzoxOCAtMDcwMA==
  content: ! "Wow, thanks so much! I'm reading \"Beginning Ruby: From Novice to Professional\",
    but the author just starts throwing attr_accessor into every single class definition
    with no real explanation.\r\n\r\nThe author makes it seem like best practice,
    but programmer friends say to never write a line of code you don't know you'll
    need. I'm not sure how I'll play it yet, but this was most helpful in at least
    understanding why devs do this."
- id: 28456
  author: Bill R
  author_email: bill_reddy@yahoo.com
  author_url: ''
  date: !binary |-
    MjAxMC0wMi0wNSAxNjowNjo0MCAtMDgwMA==
  date_gmt: !binary |-
    MjAxMC0wMi0wNiAwMDowNjo0MCAtMDgwMA==
  content: Ah great post.
- id: 29762
  author: Senthil
  author_email: senthil196@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMC0wNC0wNyAwMjoxMzoyMyAtMDcwMA==
  date_gmt: !binary |-
    MjAxMC0wNC0wNyAxMDoxMzoyMyAtMDcwMA==
  content: I always did have trouble differenting the three till I read this post.
    Thanks!
- id: 35273
  author: Mutato
  author_email: tatum@ashlandstudios.com
  author_url: ''
  date: !binary |-
    MjAxMS0wMS0yOSAwODoyNzozNSAtMDgwMA==
  date_gmt: !binary |-
    MjAxMS0wMS0yOSAxNjoyNzozNSAtMDgwMA==
  content: A light bulb above my head just turned on!  Thanks!
- id: 40842
  author: mangochiman
  author_email: mangochiman@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wNS0zMSAwMTo0MzoxNSAtMDcwMA==
  date_gmt: !binary |-
    MjAxMS0wNS0zMSAwOTo0MzoxNSAtMDcwMA==
  content: Thanks very much. It has helped me.
- id: 47850
  author: Ray
  author_email: raywu@about.me
  author_url: http://raywu.tumblr.com/
  date: !binary |-
    MjAxMS0xMC0wOCAxMzozMjowMiAtMDcwMA==
  date_gmt: !binary |-
    MjAxMS0xMC0wOCAyMTozMjowMiAtMDcwMA==
  content: ! "Hi Kevin,\r\n\r\nGreat post (noticed you wrote it in 07). Did you ever
    get to attr_accessible and attar_protected?\r\n\r\nBest,\r\n\r\n@raymond_wu"
- id: 48795
  author: Zaeem
  author_email: zaeem.arshad@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0xMC0yNCAwMzoxMzozMCAtMDcwMA==
  date_gmt: !binary |-
    MjAxMS0xMC0yNCAxMToxMzozMCAtMDcwMA==
  content: 4 years past the publication and this is still the best guide on the ruby
    attributes. Excellent job.
- id: 48924
  author: Roman
  author_email: mr.alvarado@gmail.com
  author_url: http://rome3ro.wordpress.com
  date: !binary |-
    MjAxMS0xMC0yOCAyMDoxNzoxMCAtMDcwMA==
  date_gmt: !binary |-
    MjAxMS0xMC0yOSAwNDoxNzoxMCAtMDcwMA==
  content: thanks for the post was very useful !
---
<p><img class="alignright" src="{{ site.image_path }}/274334_6040.jpg" title="Car crash" alt="Car crash" height="107" width="160" />What a mess. You have undoubtedly run across these methods sprinkled throughout the Ruby and Rails world. If you've been working with Rails for even a short time, you've probably read a little about security and <code>attr_accessible</code>. But do you really understand what each of them do and when to use them?<br />
I'm not a fan of whoever made these methods so closely named, especially because they serve very different purposes: two are specific to Rails (or more accurately, ActiveRecord), while the other three are Ruby core methods. When I have a need for any of them, I still have to really think about which one I actually want to use. Often I still have to glance at the rdocs to be reassured my choice is the right one. So let's dive in and figure out what the heck these are supposed to do, and when to use them.</p>
<p><a id="more"></a><a id="more-114"></a></p>
<h3>Forget Rails, Let's Talk Ruby Attributes</h3>
<p>I've noticed a fair number of folks try to write Rails apps without much knowledge of Ruby. That's a noble thing to try, but to be a truly effective Rails developer, you'll need to be intimately knowledgeable about the Ruby language.</p>
<p>For this reason, and to get our feet wet, we'll ignore the Rails methods for a moment and focus on the Ruby, since that's the source of three important <code>attr_*</code> methods: <code>attr_accessor</code>, <code>attr_reader</code>, and <code>attr_writer</code>. Put these three methods together in a bucket inside your head, as they are closely related.</p>
<p>Say we have a simple little Ruby class (remember we're ignoring Rails at the moment, so this is just a basic Ruby <code>Object</code> class, not an ActiveRecord model).</p>
<p class="code-source">In <span class="filename">address.rb</span>:</p>
{% highlight ruby %}
class Address

   def initialize(line1, line2, city, state, zip)
     @line1 = line1
     @line2 = line2
     @city = city
     @state = state
     @zip = zip
   end

   def to_s
     "#{@line1}\n#{@line2}\n#{@city}, #{@state} #{@zip}"
   end

end
{% endhighlight %}
<p>Our class doesn't do much yet, but we can create an <code>Address</code> instance and print it as a string using the <code>to_s</code> method:</p>
{% highlight ruby %}
irb(main):001:0> require 'address'
=> true
irb(main):002:0> address = Address.new("Centropy", "PO Box 1236", "Santa Clara", "CA", "95052")
=> #<Address:0x85908 @line2="PO Box 1236" @zip="95052" @line1="Centropy" @state="CA" @city="Santa Clara">
irb(main):003:0> puts address.to_s
Centropy
PO Box 1236
Santa Clara, CA 95052
{% endhighlight %}
<p>What if we want to be able to get each of those attributes separately from the full address, say to print out only the zip code? Trying to print the zip attribute with our current code won't work:</p>
{% highlight ruby %}
irb(main):004:0> puts address.zip
NoMethodError: undefined method `zip' for #<Address:0x85908>
        from (irb):4
        from :0
{% endhighlight %}
<p>In order to call <code>address.zip</code>, we need an attribute getter to make the <code>@zip</code> instance variable visible outside the instance. If you're from the world of Java you're probably intimately familiar with these so-called "getter" methods. So, you'd go and write your "getter" method for <code>@zip</code>:</p>
{% highlight ruby %}
class Address

   def initialize(line1, line2, city, state, zip)
     @line1 = line1
     @line2 = line2
     @city = city
     @state = state
     @zip = zip
   end

   def zip
     @zip
   end

   def to_s
     "#{@line1}\n#{@line2}\n#{@city}, #{@state} #{@zip}"
   end

end
{% endhighlight %}
<p>Okay, only four more methods to go and you can head over to the water cooler for a well-deserved break! (You get paid by the line, after all!) It feels kinda silly, though, since all these methods follow an identical pattern. Since this is such a common pattern, Ruby gives us a little shortcut: anytime you would add an attribute getter as above, you can and should use the handy <code>attr_reader</code> method instead, which effectively creates the attribute getter methods for us behind the scenes, without us having to explicitly define each method in detail. Our new class looks like this:</p>
{% highlight ruby %}
class Address

   def initialize(line1, line2, city, state, zip)
     @line1 = line1
     @line2 = line2
     @city = city
     @state = state
     @zip = zip
   end

   # Note we can give attr_reader multiple attributes,
   # and they are specified as :symbols
   attr_reader :line1, :line2, :city, :state, :zip

   def to_s
     "#{@line1}\n#{@line2}\n#{@city}, #{@state} #{@zip}"
   end

end
{% endhighlight %}
<p>Now we can grab all of our attributes apart from the full address:</p>
{% highlight ruby %}
irb(main):001:0> require 'address'
=> true
irb(main):002:0> address = Address.new("Centropy", "PO Box 1236", "Santa Clara", "CA", "95052")
=> #<Address:0x854bc @line2="PO Box 1236" @zip="95052" @line1="Centropy" @state="CA" @city="Santa Clara">
irb(main):003:0> puts address.zip
95052
{% endhighlight %}
<p>But what about <em>setting</em> the zip code?</p>
{% highlight ruby %}
irb(main):004:0> address.zip='95050'
NoMethodError: undefined method `zip=' for #<Address:0x854bc>
        from (irb):4
        from :0
{% endhighlight %}
<p>Nope, doesn't work. Maybe that's what you want: if an attribute should not be settable after the object is instantiated, you wouldn't want the ability to set the value of an attribute like this. (If you ever hear the term "immutable", that is what we're talking about here: Address instances are currently immutable because they can not be "mutated," or changed, after instantiation.) But if you do want to set your attribute values, you'll need to create a way for code outside the instance to change the value of that somewhat elusive <code>@zip</code> instance variable. Again, if you are coming from Java programming, you'd attempt to write a "setter" method here:</p>
{% highlight ruby %}
class Address

   def initialize(line1, line2, city, state, zip)
     @line1 = line1
     @line2 = line2
     @city = city
     @state = state
     @zip = zip
   end

   # Note we can give attr_reader multiple attributes,
   # and they are specified as :symbols
   attr_reader :line1, :line2, :city, :state, :zip

   # Allow setting the instance attribute to a new value
   def zip=(new_zip)
     @zip = new_zip
   end

   def to_s
     "#{@line1}\n#{@line2}\n#{@city}, #{@state} #{@zip}"
   end

end
{% endhighlight %}
<p>But, if you're starting to hear harp music right now, you might be thinking that Ruby might give us an equally simple, declarative way to make attribute setter methods as it did for getters. Lo and behold, <code>attr_writer</code> comes to the rescue:</p>
{% highlight ruby %}
class Address

   def initialize(line1, line2, city, state, zip)
     @line1 = line1
     @line2 = line2
     @city = city
     @state = state
     @zip = zip
   end

   # Note we can give attr_reader multiple attributes,
   # and they are specified as :symbols
   attr_reader :line1, :line2, :city, :state, :zip

   # Those attributes are writable, too
   attr_writer :line1, :line2, :city, :state, :zip

   def to_s
     "#{@line1}\n#{@line2}\n#{@city}, #{@state} #{@zip}"
   end

end
{% endhighlight %}
<p>And now we can set or get any attribute value:</p>
{% highlight ruby %}
irb(main):001:0> require 'address'
=> true
irb(main):002:0> address = Address.new("Centropy", "PO Box 1236", "Santa Clara", "CA", "95052")
=> #<Address:0x8519c @line2="PO Box 1236" @zip="95052" @line1="Centropy" @state="CA" @city="Santa Clara">
irb(main):003:0> address.zip='95050'
=> "95050"
irb(main):004:0> puts address.zip
95050
{% endhighlight %}
<p>Now, you might think we're in good shape: we've consolidated what would have been ten different method definitions into a two lines of declarative, readable code. Not so fast! There's a bit of redundancy in those two lines, isn't there? Specifying all your fields in two places is clearly less maintainable than if we could tell Ruby "we want getters <em>and</em> setters for this list of attributes." It might not be a big deal for our little Address class, but when you have hundreds or thousands of classes that you haven't looked at in a year, every extraneous line matters.</p>
<p>Again, this is such a common scenario in programming that Ruby offers the third attribute method, <code>attr_accessor</code>, which does exactly what two separate calls to <code>attr_reader</code> and <code>attr_writer</code> would do.</p>
<p>So, let's get rid of that repetition now:</p>
{% highlight ruby %}
class Address

   def initialize(line1, line2, city, state, zip)
     @line1 = line1
     @line2 = line2
     @city = city
     @state = state
     @zip = zip
   end

   # attr_accessor can take multiple attributes like the others,
   # and they are specified as :symbols
   attr_accessor :line1, :line2, :city, :state, :zip

   def to_s
     "#{@line1}\n#{@line2}\n#{@city}, #{@state} #{@zip}"
   end

end
{% endhighlight %}
<p>And this works <em>exactly</em> like the previous example:</p>
{% highlight ruby %}
irb(main):001:0> require 'address'
=> true
irb(main):002:0> address = Address.new("Centropy", "PO Box 1236", "Santa Clara", "CA", "95052")
=> #<Address:0x8519c @line2="PO Box 1236" @zip="95052" @line1="Centropy" @state="CA" @city="Santa Clara">
irb(main):003:0> address.zip='95050'
=> "95050"
irb(main):004:0> puts address.zip
95050
{% endhighlight %}
<p>Hopefully this clarifies what these three methods are for. Next time, we'll explore the similarly-named-but-entirely-different-purposed <code>attr_protected</code> and <code>attr_accessible</code> methods brought to us by Rails' ActiveRecord models.</p>
<h3>Further Reading</h3>
<p>The <code>attr_accessor</code>, <code>attr_reader</code>, and <code>attr_writer</code> methods are fairly well documented in the <a href="http://corelib.rubyonrails.org/classes/Module.html#M000794">Ruby core rdocs</a>.</p>
<h3>Feedback and Article Ideas</h3>
<p>Want to see a topic explored here? <a href="/contact">Send Me a Message</a>.</p>
