---
title: "Indispensable Rails Plugins"
date: 2007-09-04T00:00:00-08:00
---

<p><a href="http://www.jroller.com/obie/entry/rails_plugins_worth_their_something">Obie Fernandez's post about his most favored plugins</a> prompted me to consider how much I use not only the Rails core framework, but also some excellent plugins that let me focus more on solving domain problems rather than technical ones. Below, the plugins I find indispensable in my work on <a href="http://dibs.net">Dibs.net</a>.</p>
<p><a id="more"></a><a id="more-117"></a></p>
<p>Dibs.net relies on these great plugins, some hacked slightly to suit my needs. These plugins have saved me months of work and enabled far greater functionality to be built-in from the start.</p>
<ul>
<li><strong><a href="http://code.dunae.ca/acts_as_slugable.html">acts_as_slugable</a></strong> - Easy way to create permalinks from a title, without numeric IDs.</li>
<li><strong><a href="http://acts_as_solr.railsfreaks.com/">acts_as_solr</a></strong> - Running Solr behind your ActiveRecord models gives you excellent "Google-like" searching. IMO, better than <code>acts_as_ferret</code> for many uses where you can handle the added architectural complexity (particularly, running a Java-based Solr server).</li>
<li><strong><a href="http://elitists.textdriven.com/svn/plugins/acts_as_state_machine">acts_as_state_machine</a></strong> - This is probably my favorite plugin. So good, I think it should be a part of ActiveRecord itself. If you have objects in "draft," "published" or "active" states you might want to check this out.</li>
<li><strong><a href="http://svn.techno-weenie.net/projects/plugins/attachment_fu/README">attachment_fu</a></strong> - If file uploads give you a severe headache, attachment_fu is like Advil.</li>
<li><strong><a href="http://opensource.symetrie.com/trac/better_nested_set/">betternestedset</a></strong> - Gives you higher performance selection methods like <code>all_children</code>. The API takes some getting used to and isn't suitable to replace existing solutions in all cases.</li>
<li><strong><a href="http://www.realityforge.org/articles/2006/03/20/rails-plugin-to-help-debug-views">debug_view_helper</a></strong> - Adds a button to your page that pops up debugging info about the request, cookies, session and instance variables.</li>
<li><strong><a href="http://dev.rubyonrails.org/svn/rails/plugins/exception_notification/">exception_notification</a></strong> - Sends a ticket to my support queue whenever a user experiences an error.</li>
<li><strong><a href="http://geokit.rubyforge.org/">geokit</a></strong> - <a href="http://earthcode.com/">Andre Lewis</a> and <a href="http://blog.billeisenhauer.com/">Bill Eisenhauer</a> have done some amazing stuff here. Adds geo-intelligence (street address and IP geocoding) to ActiveRecords; also adds query-by-proximity, though I don't use that piece.</li>
<li><strong><a href="http://cardboardrocket.com/pages/paginating_find">paginating_find</a></strong> - Another one that should be embedded into core ActiveRecord to replace the existing pagination that everyone recommends never to use.</li>
</ul>
<p>Do you use any great plugins you think people would love?</p>
<h3>Feedback and Article Ideas</h3>
<p>Want to see a topic explored here? <a href="https://twitter.com/{{ site.twitter_username }}">Send Me a Message</a>.</p>
