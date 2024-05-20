const GithubConnection = require("../models/githubConnection.model");
const Ticket = require("../models/tickets.model");
const {
  getBoardByTicketId,
} = require("../services/boardsService/getBoardOfEntity.service");
const axiosGithubServer = require("../services/gitHubConnection/github.server");
const { getDetailTicket } = require("../services/tickets.service");

const DepartmentService = require("../services/departments.service");
const BoardService = require("../services/boards.service");
const { eventEmitter } = require("../services/eventEmitter.service");
const { ActivityType } = require("../services/activities/activity.constants");
const Task = require("../models/tasks.model");

const githubConnectionController = {
  createGithubDataByBoard: async (req, res) => {
    try {
      const board = await BoardService.getBoardById(req.boardId);
      if (!board) {
        throw new Error("Board not found!");
      }

      const canAccessBoard =
        await DepartmentService.checkUserBelongToDepartment(
          req.data,
          board.department
        );

      if (!canAccessBoard) {
        return res
          .status(403)
          .json({ message: "You dont have permission on this board!" });
      }

      const newData = new GithubConnection({
        username: null,
        accessToken: null,
        data: {
          repositories: [],
        },
        board: req.boardId,
      });
      const saveData = await newData.save();
      res.status(200).json(saveData);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  showGithubDataByBoard: async (req, res) => {
    try {
      const board = await BoardService.getBoardById(req.boardId);
      if (!board) {
        throw new Error("Board not found!");
      }

      const canAccessBoard =
        await DepartmentService.checkUserBelongToDepartment(
          req.data,
          board.department
        );

      if (!canAccessBoard) {
        return res
          .status(403)
          .json({ message: "You dont have permission on this board!" });
      }

      const github = await GithubConnection.findOne({ board: req.boardId });
      res.status(200).json(github);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  updateGithubData: async (req, res) => {
    try {
      const board = await BoardService.getBoardById(req.boardId);
      if (!board) {
        throw new Error("Board not found!");
      }

      const canAccessBoard =
        await DepartmentService.checkUserBelongToDepartment(
          req.data,
          board.department
        );

      if (!canAccessBoard) {
        return res
          .status(403)
          .json({ message: "You dont have permission on this board!" });
      }

      const githubUpdate = await GithubConnection.findOneAndUpdate(
        { board: req.boardId },
        req.body,
        { new: true }
      );
      res.status(200).json(githubUpdate);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  checkCommitsInTicket: async (req, res) => {
    try {
      const [detailTicket, board] = await Promise.all([
        getDetailTicket(req.ticketId),
        getBoardByTicketId(req.ticketId),
      ]);
      if (!detailTicket || !board) {
        return res.status(404).json({
          message: "ticket not found",
        });
      }
      const github = await GithubConnection.findOne({ board: board._id });
      if (github) {
        if (detailTicket.members.length > 0) {
          const listBranchName = detailTicket.members.map(
            (member) =>
              member.username +
              "/t-" +
              detailTicket._id +
              "/" +
              detailTicket.name
                .toLowerCase()
                .replace(/[^a-z0-9 ]/g, "")
                .replace(/\s+/g, " ")
                .trim()
                .split(" ")
                .slice(0, 6)
                .join("-")
          );
          const listTaskName = detailTicket.tasks.map(
            (task) =>
              "task-" +
              task._id +
              "/" +
              task.name
                .toLowerCase()
                .replace(/[^a-z0-9 ]/g, "")
                .replace(/\s+/g, " ")
                .trim()
                .split(" ")
                .slice(0, 6)
                .join("-")
          );
          const listTaskComplete = [];
          const listTaskAsync = [];
          await Promise.all(
            listBranchName.map(async (branch) => {
              await Promise.all(
                github.data.repositories.map(async (repo) => {
                  const urlParts = repo.split("/");
                  const repoName = urlParts[urlParts.length - 1];
                  const owner = urlParts[urlParts.length - 2];
                  await axiosGithubServer(github)
                    .get(`/repos/${owner}/${repoName}/commits?sha=${branch}`)
                    .then(async (commits) => {
                      await Promise.all(
                        commits.data.map(async (commit) => {
                          const found = listTaskName.findIndex(
                            (element) => element === commit.commit.message
                          );

                          if (
                            found >= 0 &&
                            !listTaskComplete.includes(
                              detailTicket.tasks[found]
                            )
                          ) {
                            if (
                              detailTicket.tasks[found].status != "complete"
                            ) {
                              listTaskComplete.push(detailTicket.tasks[found]);
                              listTaskAsync.push(
                                Task.findByIdAndUpdate(
                                  detailTicket.tasks[found]._id.toString(),
                                  { status: "complete" },
                                  {
                                    new: true,
                                  }
                                )
                              );
                            }
                          }
                        })
                      );
                      const result = await Promise.all(
                        listTaskAsync.map(async (item) => {
                          const val = await item;
                          eventEmitter.emit(ActivityType.USER_UPDATE_TASK, {
                            boardActive: board,
                            clientId: req.headers.clientid,
                            ticketId: String(detailTicket._id),
                            taskUpdate: val,
                            ticketActive: detailTicket,
                          });

                          const contentChange = {
                            name: val?.name,
                            status: val?.status,
                          };
                          if (val.status === "complete") {
                            val.status = "active";
                            eventEmitter.emit(
                              ActivityType.USER_COMPLETED_TASK,
                              {
                                activeUser: {
                                  _id: req.data._id,
                                  name: req.data.name,
                                },
                                task: val,
                                change: contentChange,
                              }
                            );
                          } else {
                            val.status = "complete";

                            eventEmitter.emit(
                              ActivityType.USER_UN_COMPLETED_TASK,
                              {
                                activeUser: {
                                  _id: req.data._id,
                                  name: req.data.name,
                                },
                                task: val,
                                change: contentChange,
                              }
                            );
                          }
                          return val;
                        })
                      );
                      res.status(200).json(result);
                    })
                    .catch((err) => {
                      console.log("err");
                    });
                })
              );
            })
          );
        }
      } else {
        res.status(400).json({ message: "Have not connected to github yet" });
      }
    } catch (error) {
      console.log(error.message);
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Pull-requests for ticket
  getPullRequestsInTicket: async (req, res) => {
    try {
      const [detailTicket, board] = await Promise.all([
        getDetailTicket(req.ticketId),
        getBoardByTicketId(req.ticketId),
      ]);
      if (!detailTicket || !board) {
        return res.status(404).json({
          message: "ticket not found",
        });
      }
      const github = await GithubConnection.findOne({ board: board._id });
      if (github) {
        repositories = await axiosGithubServer(github).get("/user/repos");

        const boardRepos = github.data.repositories
          .map((boardRepo) =>
            repositories.data.find((userRepo) =>
              boardRepo.toLowerCase().includes(userRepo.full_name.toLowerCase())
            )
          )
          .filter((repo) => (repo ? true : false));

        const ticketPRs = [];
        if (detailTicket.members.length > 0) {
          await Promise.all(
            detailTicket.members.map(async (member) => {
              const branchName =
                member.username +
                "/t-" +
                detailTicket._id +
                "/" +
                detailTicket.name
                  .toLowerCase()
                  .replace(/[^a-z0-9 ]/g, "")
                  .replace(/\s+/g, " ")
                  .trim()
                  .split(" ")
                  .slice(0, 6)
                  .join("-");

              await Promise.all(
                boardRepos.map(async (repo) => {
                  try {
                    if (repo) {
                      await axiosGithubServer(github)
                        .get(
                          `/repos/${
                            repo.full_name
                          }/pulls?state=all&sort=long-running&head=${
                            repo.full_name.split("/")[0]
                          }:${branchName}`
                        )
                        .then((pullRqsData) => {
                          if (pullRqsData.data.length > 0) {
                            ticketPRs.push({
                              [repo.full_name]: pullRqsData.data,
                            });
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                      return repo;
                    }
                  } catch (error) {
                    console.log(error);
                  }
                })
              );
              return member;
            })
          );
        }
        res.status(200).json(ticketPRs);
      } else {
        res.status(400).json({ message: "Have not connected to github yet" });
      }
    } catch (error) {
      console.log(error.message);
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};
module.exports = githubConnectionController;
