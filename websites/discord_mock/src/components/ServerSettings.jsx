import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Search, Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { generateId } from '../lib/utils';

export default function ServerSettings({ serverId, onClose }) {
  const [activeSection, setActiveSection] = useState('Overview');
  const [serverName, setServerName] = useState('');
  const [serverDescription, setServerDescription] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#99aab5');
  const [newRoleHoist, setNewRoleHoist] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [auditLog, setAuditLog] = useState([
    { id: '1', action: 'Server created', timestamp: new Date(Date.now() - 86400000 * 30).toISOString() },
  ]);

  const store = useStore();
  const navigate = useNavigate();
  const server = store.servers[serverId];

  // Initialize local state from server on first render
  React.useEffect(() => {
    if (server) {
      setServerName(server.name);
      setServerDescription(server.description || '');
    }
  }, [serverId]);

  if (!server) return null;

  const serverRoles = (server.roles || []).map(id => store.roles[id]).filter(Boolean);
  const serverMembers = (server.members || []).map(id => store.users[id]).filter(Boolean);

  const filteredMembers = memberSearch
    ? serverMembers.filter(m => m.username.toLowerCase().includes(memberSearch.toLowerCase()))
    : serverMembers;

  const sections = [
    { category: server.name.toUpperCase(), items: ['Overview', 'Roles', 'Emoji', 'Stickers'] },
    { category: 'MODERATION', items: ['Safety Setup', 'AutoMod', 'Audit Log', 'Bans'] },
    { category: 'COMMUNITY', items: ['Members'] },
  ];

  const handleSaveChanges = () => {
    if (serverName.trim() && serverName !== server.name) {
      store.renameServer(serverId, serverName.trim());
      setAuditLog(prev => [{ id: generateId(), action: `Server renamed to "${serverName.trim()}"`, timestamp: new Date().toISOString() }, ...prev]);
    }
    if (serverDescription !== server.description) {
      useStore.setState(state => ({
        servers: {
          ...state.servers,
          [serverId]: { ...state.servers[serverId], description: serverDescription }
        }
      }));
    }
  };

  const handleDeleteServer = () => {
    store.deleteServer(serverId);
    navigate('/channels/@me');
    onClose();
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;
    const roleId = generateId();
    const newRole = {
      id: roleId,
      serverId,
      name: newRoleName.trim(),
      color: newRoleColor,
      position: serverRoles.length,
      permissions: ['SEND_MESSAGES', 'READ_MESSAGES'],
      hoist: newRoleHoist,
      mentionable: true
    };
    useStore.setState(state => ({
      roles: { ...state.roles, [roleId]: newRole },
      servers: {
        ...state.servers,
        [serverId]: { ...state.servers[serverId], roles: [...(state.servers[serverId].roles || []), roleId] }
      }
    }));
    setAuditLog(prev => [{ id: generateId(), action: `Role "${newRoleName.trim()}" created`, timestamp: new Date().toISOString() }, ...prev]);
    setNewRoleName('');
    setNewRoleColor('#99aab5');
    setNewRoleHoist(false);
    setShowCreateRoleModal(false);
  };

  const handleDeleteRole = (roleId) => {
    const role = store.roles[roleId];
    useStore.setState(state => {
      const newRoles = { ...state.roles };
      delete newRoles[roleId];
      return {
        roles: newRoles,
        servers: {
          ...state.servers,
          [serverId]: {
            ...state.servers[serverId],
            roles: (state.servers[serverId].roles || []).filter(id => id !== roleId)
          }
        }
      };
    });
    if (role) {
      setAuditLog(prev => [{ id: generateId(), action: `Role "${role.name}" deleted`, timestamp: new Date().toISOString() }, ...prev]);
    }
  };

  const isDirty = serverName !== server.name || serverDescription !== (server.description || '');

  return (
    <div className="fixed inset-0 z-50 flex bg-discord-bg">
      {/* Settings Sidebar */}
      <div className="w-[218px] bg-discord-dark flex flex-col items-end overflow-y-auto custom-scrollbar pt-16 pb-8 shrink-0">
        <div className="w-[190px] pr-2">
          {sections.map(section => (
            <div key={section.category} className="mb-2">
              <div className="text-xs font-bold text-discord-muted uppercase px-2.5 py-1.5 truncate">{section.category}</div>
              {section.items.map(item => (
                <button
                  key={item}
                  onClick={() => setActiveSection(item)}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded text-sm mb-0.5",
                    activeSection === item
                      ? "bg-discord-selected text-white"
                      : "text-discord-modifier hover:bg-discord-light/50 hover:text-discord-lightest"
                  )}
                >
                  {item}
                </button>
              ))}
              <div className="h-px bg-discord-divider my-2 mx-2.5" />
            </div>
          ))}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full text-left px-2.5 py-1.5 rounded text-sm text-discord-red hover:bg-discord-light/50"
          >
            Delete Server
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-16 pb-8 px-10 max-w-[740px]">
        {activeSection === 'Overview' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-5">Server Overview</h2>
            <div className="flex gap-8">
              <div className="shrink-0">
                <div className="w-24 h-24 rounded-full bg-discord-light flex items-center justify-center overflow-hidden">
                  <img src={server.icon} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-discord-muted mt-2 text-center">Server Icon</p>
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <label className="text-xs font-bold text-discord-muted uppercase block mb-2">Server Name</label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full bg-discord-darker text-discord-lightest px-3 py-2 rounded outline-none border border-discord-darker focus:border-discord-blurple"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xs font-bold text-discord-muted uppercase block mb-2">Description</label>
                  <textarea
                    value={serverDescription}
                    onChange={(e) => setServerDescription(e.target.value)}
                    className="w-full bg-discord-darker text-discord-lightest px-3 py-2 rounded outline-none border border-discord-darker focus:border-discord-blurple text-sm resize-none"
                    rows={3}
                    placeholder="Tell everyone what this server is about!"
                  />
                </div>
                {isDirty && (
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => { setServerName(server.name); setServerDescription(server.description || ''); }}
                      className="px-4 py-1.5 text-sm text-white hover:underline mr-2"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="px-4 py-1.5 text-sm font-medium bg-discord-green hover:bg-discord-green/80 text-white rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
                <div className="flex gap-4 text-sm text-discord-muted">
                  <div>
                    <span className="text-discord-lightest font-medium">{server.members.length}</span> Members
                  </div>
                  <div>
                    <span className="text-discord-lightest font-medium">{server.channels.length}</span> Channels
                  </div>
                  {server.boostCount > 0 && (
                    <div>
                      <span className="text-discord-lightest font-medium">{server.boostCount}</span> Boosts
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'Roles' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">Roles</h2>
              <button
                onClick={() => setShowCreateRoleModal(true)}
                className="flex items-center bg-discord-blurple hover:bg-discord-blurple/80 text-white text-sm font-medium px-3 py-1.5 rounded"
              >
                <Plus size={14} className="mr-1" /> Create Role
              </button>
            </div>
            <p className="text-discord-muted text-sm mb-4">Use roles to group your server members and assign permissions.</p>
            <div className="space-y-2">
              {serverRoles.map(role => (
                <div key={role.id} className={cn(
                  "flex items-center bg-discord-dark rounded-lg p-3 hover:bg-discord-light/30 cursor-pointer",
                  editingRoleId === role.id && "ring-1 ring-discord-blurple"
                )} onClick={() => setEditingRoleId(editingRoleId === role.id ? null : role.id)}>
                  <div className="w-3 h-3 rounded-full mr-3 shrink-0" style={{ backgroundColor: role.color }} />
                  <div className="flex-1">
                    <div className="font-medium text-white">{role.name}</div>
                    <div className="text-xs text-discord-muted">
                      {serverMembers.filter(m => (m.roles || []).includes(role.id)).length} member{serverMembers.filter(m => (m.roles || []).includes(role.id)).length !== 1 ? 's' : ''}
                      {role.hoist && ' • Displayed separately'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-discord-muted">Position: {role.position}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }}
                      className="p-1 rounded hover:bg-discord-red/20 text-discord-muted hover:text-discord-red"
                      title="Delete role"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {serverRoles.length === 0 && (
                <p className="text-discord-muted text-sm">No custom roles yet. Create one!</p>
              )}
            </div>

            {/* Create Role Modal */}
            {showCreateRoleModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70" onClick={() => setShowCreateRoleModal(false)}>
                <div className="w-[440px] bg-discord-dark rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Create Role</h3>
                    <div className="mb-4">
                      <label className="text-xs font-bold text-discord-muted uppercase block mb-2">Role Name</label>
                      <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="new role"
                        className="w-full bg-discord-darker text-discord-lightest px-3 py-2 rounded outline-none border border-discord-darker focus:border-discord-blurple text-sm"
                        autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCreateRole(); }}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-bold text-discord-muted uppercase block mb-2">Role Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={newRoleColor}
                          onChange={(e) => setNewRoleColor(e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                        />
                        <span className="text-sm text-discord-lightest">{newRoleColor}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <div className="text-discord-lightest text-sm font-medium">Display role separately from others</div>
                        <div className="text-xs text-discord-muted">Roles toggled on will appear in the sidebar.</div>
                      </div>
                      <button
                        onClick={() => setNewRoleHoist(!newRoleHoist)}
                        className={cn(
                          "w-10 h-6 rounded-full transition-colors relative shrink-0 ml-4",
                          newRoleHoist ? "bg-discord-green" : "bg-discord-muted/40"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                          newRoleHoist ? "left-5" : "left-1"
                        )} />
                      </button>
                    </div>
                  </div>
                  <div className="bg-discord-darker p-4 flex justify-end gap-3">
                    <button
                      onClick={() => setShowCreateRoleModal(false)}
                      className="px-4 py-2 text-sm text-white hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateRole}
                      disabled={!newRoleName.trim()}
                      className={cn(
                        "px-4 py-2 text-sm font-medium text-white rounded",
                        newRoleName.trim() ? "bg-discord-blurple hover:bg-discord-blurple/80" : "bg-discord-blurple/50 cursor-not-allowed"
                      )}
                    >
                      Create Role
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'Members' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-5">Server Members</h2>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search members"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full bg-discord-darker text-discord-lightest px-3 py-2 pl-9 rounded outline-none"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-discord-muted" />
            </div>
            <div className="text-xs text-discord-muted mb-3 font-bold uppercase">
              {filteredMembers.length} Member{filteredMembers.length !== 1 ? 's' : ''}
            </div>
            <div className="space-y-1">
              {filteredMembers.map(member => {
                const memberRoles = (member.roles || []).map(id => store.roles[id]).filter(Boolean);
                return (
                  <div key={member.id} className="flex items-center p-2 rounded hover:bg-discord-light/30">
                    <div className="relative mr-3">
                      <img src={member.avatar} alt="" className="w-8 h-8 rounded-full" />
                      <div className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-discord-bg",
                        member.status === 'online' ? "bg-discord-online" :
                        member.status === 'idle' ? "bg-discord-idle" :
                        member.status === 'dnd' ? "bg-discord-dnd" : "bg-discord-offline"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="font-medium text-white text-sm">{member.username}</span>
                        <span className="text-xs text-discord-muted ml-1">#{member.discriminator}</span>
                        {member.isBot && (
                          <span className="bg-discord-blurple text-white text-[10px] font-bold px-1 py-0 rounded ml-1">BOT</span>
                        )}
                      </div>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {memberRoles.map(role => (
                          <span key={role.id} className="flex items-center text-[10px] bg-discord-darker rounded px-1.5 py-0.5">
                            <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: role.color }} />
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {member.id === server.ownerId && <span className="text-xs text-discord-muted">👑 Owner</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'Emoji' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-5">Emoji</h2>
            <p className="text-discord-muted text-sm mb-4">Upload custom emoji for members of this server to use. Server Emoji can also be used as reactions.</p>
            <div className="bg-discord-dark rounded-lg p-4 text-center">
              <p className="text-discord-muted text-sm">No custom emoji have been uploaded yet.</p>
              <button
                onClick={() => {
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.accept = 'image/png,image/gif,image/webp';
                  fileInput.onchange = (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAuditLog(prev => [{ id: generateId(), action: `Emoji "${file.name}" uploaded`, timestamp: new Date().toISOString() }, ...prev]);
                    }
                  };
                  fileInput.click();
                }}
                className="mt-3 bg-discord-blurple hover:bg-discord-blurple/80 text-white text-sm font-medium px-4 py-2 rounded"
              >
                Upload Emoji
              </button>
            </div>
          </div>
        )}

        {activeSection === 'Stickers' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-5">Stickers</h2>
            <p className="text-discord-muted text-sm mb-4">Upload custom stickers for members to use in this server.</p>
            <div className="bg-discord-dark rounded-lg p-4 text-center">
              <p className="text-discord-muted text-sm">No custom stickers have been uploaded yet.</p>
              <button
                onClick={() => {
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.accept = 'image/png,image/gif,image/apng';
                  fileInput.onchange = (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAuditLog(prev => [{ id: generateId(), action: `Sticker "${file.name}" uploaded`, timestamp: new Date().toISOString() }, ...prev]);
                    }
                  };
                  fileInput.click();
                }}
                className="mt-3 bg-discord-blurple hover:bg-discord-blurple/80 text-white text-sm font-medium px-4 py-2 rounded"
              >
                Upload Sticker
              </button>
            </div>
          </div>
        )}

        {activeSection === 'Safety Setup' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-5">Safety Setup</h2>
            <p className="text-discord-muted text-sm mb-4">Set up safety features to help protect your server.</p>
            <div className="space-y-3">
              <PersistedSafetyToggle serverId={serverId} store={store} settingKey="verificationLevel" label="Verification Level" desc="Members must have a verified email on their Discord account." defaultVal={false} />
              <PersistedSafetyToggle serverId={serverId} store={store} settingKey="explicitMediaFilter" label="Explicit Media Content Filter" desc="Scan media content from all members." defaultVal={true} />
              <PersistedSafetyToggle serverId={serverId} store={store} settingKey="dmsFromStrangers" label="Block DMs from server members" desc="Automatically block DMs from members not in your friend list." defaultVal={false} />
            </div>
          </div>
        )}

        {activeSection === 'AutoMod' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-5">AutoMod</h2>
            <p className="text-discord-muted text-sm mb-4">AutoMod automatically detects and takes action on harmful content in your server.</p>
            <div className="space-y-3">
              <PersistedSafetyToggle serverId={serverId} store={store} settingKey="automodFlaggedWords" label="Block Commonly Flagged Words" desc="Block profanity, sexual content, and slurs." defaultVal={true} />
              <PersistedSafetyToggle serverId={serverId} store={store} settingKey="automodSpam" label="Block Spam Content" desc="Block messages suspected of being spam." defaultVal={true} />
              <PersistedSafetyToggle serverId={serverId} store={store} settingKey="automodMentionSpam" label="Block Mention Spam" desc="Block messages with an abnormal amount of mentions." defaultVal={false} />
            </div>
          </div>
        )}

        {activeSection === 'Audit Log' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-5">Audit Log</h2>
            <p className="text-discord-muted text-sm mb-4">Here you can view a list of all administrative actions taken in this server.</p>
            <div className="space-y-2">
              {auditLog.map(entry => (
                <div key={entry.id} className="bg-discord-dark rounded-lg p-3 flex items-center justify-between text-sm">
                  <div>
                    <span className="text-white">{entry.action}</span>
                  </div>
                  <span className="text-xs text-discord-muted ml-4 shrink-0">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'Bans' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-5">Bans</h2>
            <p className="text-discord-muted text-sm mb-4">Members who have been banned from this server.</p>
            <div className="bg-discord-dark rounded-lg p-6 text-center">
              <p className="text-discord-muted text-sm">No bans yet. Hopefully it stays that way!</p>
            </div>
          </div>
        )}
      </div>

      {/* Close Button */}
      <div className="flex flex-col items-center pt-16 px-4 shrink-0">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full border-2 border-discord-muted text-discord-muted hover:border-white hover:text-white flex items-center justify-center"
        >
          <X size={18} />
        </button>
        <span className="text-xs text-discord-muted mt-1.5 font-bold">ESC</span>
      </div>

      {/* Delete Server Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70" onClick={() => setShowDeleteConfirm(false)}>
          <div className="w-[440px] bg-discord-dark rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white mb-2">Delete '{server.name}'</h2>
              <p className="text-discord-modifier mb-4">
                Are you sure you want to delete <strong>{server.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="bg-discord-darker p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-white hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteServer}
                className="px-4 py-2 text-sm font-medium bg-discord-red hover:bg-discord-red/80 text-white rounded"
              >
                Delete Server
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// A safety toggle that persists per-server setting to the store via userSettings
function PersistedSafetyToggle({ serverId, store, settingKey, label, desc, defaultVal }) {
  const userSettings = store.userSettings || {};
  const fullKey = `server_${serverId}_${settingKey}`;
  const enabled = fullKey in userSettings ? userSettings[fullKey] : defaultVal;

  return (
    <div className="flex items-center justify-between bg-discord-dark rounded-lg p-3">
      <div>
        <div className="text-white font-medium text-sm">{label}</div>
        {desc && <div className="text-xs text-discord-muted mt-0.5">{desc}</div>}
      </div>
      <button
        onClick={() => store.updateUserSettings({ [fullKey]: !enabled })}
        className={cn(
          "w-10 h-6 rounded-full transition-colors relative shrink-0 ml-4",
          enabled ? "bg-discord-green" : "bg-discord-muted/40"
        )}
      >
        <div className={cn(
          "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
          enabled ? "left-5" : "left-1"
        )} />
      </button>
    </div>
  );
}
