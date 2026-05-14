
    import React, { useState } from 'react';
    import { useOutletContext, Link, useNavigate } from 'react-router-dom';
    import { GitCommit, Copy, Check } from 'lucide-react';
    import { useStore } from '../../lib/store';

    export default function Commits() {
      const { repo, owner } = useOutletContext();
      const { state } = useStore();
      const navigate = useNavigate();
      const [copiedId, setCopiedId] = useState(null);

      const commits = state.commits
        .filter(c => c.repoId === repo.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const handleCopy = (commitId) => {
        navigator.clipboard.writeText(commitId).then(() => {
          setCopiedId(commitId);
          setTimeout(() => setCopiedId(null), 2000);
        });
      };

      return (
        <div className="max-w-4xl mx-auto">
          <div className="border border-github-border rounded-md overflow-hidden">
            <div className="bg-[#161b22] border-b border-github-border p-3 text-sm font-semibold text-github-text">
              Commits
            </div>

            <div className="divide-y divide-github-border bg-github-bg">
              {commits.map(commit => {
                const author = state.users.find(u => u.id === commit.authorId);
                return (
                  <div key={commit.id} className="p-4 hover:bg-[#161b22] flex items-center justify-between group">
                    <div className="flex flex-col gap-1">
                      <Link
                        to={`/${owner?.username}/${repo.name}/commit/${commit.id}`}
                        className="font-semibold text-github-text hover:text-github-accent hover:underline text-sm"
                      >
                        {commit.message}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-github-muted">
                        <img src={author?.avatar} alt={author?.username} className="w-4 h-4 rounded-full" />
                        <span className="font-semibold text-github-text">{author?.username}</span>
                        <span>committed on {new Date(commit.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <div className="flex border border-github-border rounded-md overflow-hidden">
                          <button
                            onClick={() => navigate(`/${owner?.username}/${repo.name}/commit/${commit.id}`)}
                            className="px-2 py-1 bg-[#161b22] hover:bg-[#21262d] text-xs font-mono text-github-accent border-r border-github-border"
                          >
                             {commit.id.substring(0, 7)}
                          </button>
                          <button
                            onClick={() => handleCopy(commit.id)}
                            className="px-2 py-1 bg-[#161b22] hover:bg-[#21262d] text-github-muted"
                            title="Copy commit SHA"
                          >
                            {copiedId === commit.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          </button>
                       </div>
                       <Link
                          to={`/${owner?.username}/${repo.name}/commit/${commit.id}`}
                          className="p-2 text-github-muted hover:text-github-accent hover:bg-[#21262d] rounded-md"
                          title="View commit"
                       >
                          <GitCommit size={16} />
                       </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
