# Git Rebase - Why, When and How?

&copy; 2017 Adrian Herzog

Understanding the many features of Git is hard. I only know a small part of it well that I use on a daily basis. As this [paper](http://static.googleusercontent.com/media/research.google.com/de//pubs/archive/42942.pdf) suggests, this is true for many programmers.

That's why it took me a long time to start using rebase. Now that I use it to integrate changes into my own branches, I am a big fan of it and would like to spread the word.


# Why?

The main reason I see for using rebase is to keep the Git history clean and linear on the main branch. Developers often want to (and should) integrate changes from the main branch into their feature branches. When using merge for this, this generates a merge commit each time which later pollutes the history after the feature is merged back to the main branch.

Another reason is to clean up commit messages or to combine some commits using interactive rebase.

# When?

The most important rules, when to do it and when to leave it:

* The golden rule of git rebase: never use it on public branches
* If you don't know exactly what you're doing, use "merge" and live with a history that has a few merge commits more than necessary.
* If you know what you're doing, use it to get a cleaner history where it makes sense:
  * Clean up local commits or private feature branches
  * Integrate upstream changes into private feature branches
  * Clean up history of an accepted pull request

If you have time for some more details, I can recommend these two articles by Atlassian:

* [Git team workflows: merge or rebase?](https://www.atlassian.com/git/articles/git-team-workflows-merge-or-rebase/)
* [Merging vs. Rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing/workflow-walkthrough)

# How?

[Nathan LeClaire explains it well](https://nathanleclaire.com/blog/2014/09/14/dont-be-scared-of-git-rebase/), so no need to repeat it.