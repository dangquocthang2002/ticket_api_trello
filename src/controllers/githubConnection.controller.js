const GithubConnection = require("../models/githubConnection.model");
const Ticket = require("../models/tickets.model");
const {
  getBoardByTicketId,
} = require("../services/boardsService/getBoardOfEntity.service");
const axiosGithubServer = require("../services/gitHubConnection/github.server");
const { getDetailTicket } = require("../services/tickets.service");

const DepartmentService = require("../services/departments.service");
const BoardService = require("../services/boards.service");

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
